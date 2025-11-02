// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require('openai');
const Stripe = require('stripe');
const { v4: uuidv4 } = require('uuid');

const app = express();
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:3000';
app.use(cors({ origin: FRONTEND_HOST }));
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if(!SUPABASE_URL || !SUPABASE_KEY){ console.error('Missing SUPABASE'); process.exit(1); }
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if(!OPENAI_API_KEY){ console.error('Missing OPENAI_API_KEY'); process.exit(1); }
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

const STRIPE_SECRET = process.env.STRIPE_SECRET || '';
const stripe = STRIPE_SECRET ? Stripe(STRIPE_SECRET) : null;

// health
app.get('/api/health', (req,res) => res.json({ ok:true }));

// Create AI role
app.post('/api/ai-roles', async (req, res) => {
  try {
    const { owner_id = null, name, personality, catchphrase = null, interests = [], avatar_url = null } = req.body;
    if(!name || !personality) return res.status(400).json({ success:false, message:'name & personality required' });
    const roleId = uuidv4();
    const { error } = await supabase.from('ai_roles').insert([{ id: roleId, user_id: owner_id, name, personality, catchphrase, interests, avatar_url }]);
    if(error) return res.status(500).json({ success:false, error });
    res.json({ success:true, roleId });
  } catch(err){ console.error(err); res.status(500).json({ success:false, message:err.message }); }
});

// Get role
app.get('/api/ai-roles/:id', async (req,res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('ai_roles').select('*').eq('id', id).single();
    if(error) return res.status(404).json({ success:false, message:'Role not found' });
    res.json({ role: data });
  } catch(err){ res.status(500).json({ success:false }); }
});

// Chat (OpenAI)
app.post('/api/chat', async (req,res) => {
  try {
    const { message, roleId, user_id } = req.body;
    if(!message || !roleId) return res.status(400).json({ reply: 'message & roleId required' });

    const { data: roleData } = await supabase.from('ai_roles').select('*').eq('id', roleId).single();
    if(!roleData) return res.status(400).json({ reply:'Role not found' });

    const systemPrompt = `
You are an empathetic AI companion.
Role name: ${roleData.name}
Personality: ${roleData.personality}
Catchphrase: ${roleData.catchphrase || 'N/A'}
Interests: ${roleData.interests ? roleData.interests.join(', ') : 'N/A'}
Reply concisely, kindly and safely.
`;

    const completion = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 350
    });

    const reply = completion.data.choices[0].message.content.trim();

    // try write to chat_messages or chats
    try {
      await supabase.from('chat_messages').insert([
        { id: uuidv4(), role_id: roleId, user_id: user_id || null, sender: 'user', message },
        { id: uuidv4(), role_id: roleId, user_id: user_id || null, sender: 'bot', message: reply }
      ]);
    } catch(e){
      await supabase.from('chats').insert([
        { id: uuidv4(), ai_role_id: roleId, user_id: user_id || null, message, sender: 'user' },
        { id: uuidv4(), ai_role_id: roleId, user_id: user_id || null, message: reply, sender: 'ai' }
      ]).catch(()=>{});
    }

    res.json({ reply });
  } catch(err){ console.error(err); res.status(500).json({ reply:'AI failed' }); }
});

// chat history
app.get('/api/chat-history', async (req,res) => {
  try {
    const { roleId, userId } = req.query;
    if(!roleId || !userId) return res.status(400).json({ messages: [] });
    const { data, error } = await supabase.from('chat_messages').select('*').eq('role_id', roleId).eq('user_id', userId).order('created_at', { ascending:true });
    if(error) {
      const { data: fallback } = await supabase.from('chats').select('*').eq('ai_role_id', roleId).eq('user_id', userId).order('created_at', { ascending:true });
      return res.json({ messages: fallback || [] });
    }
    res.json({ messages: data || [] });
  } catch(err){ console.error(err); res.status(500).json({ messages: [] }); }
});

// Treehole
app.post('/api/treehole', async (req,res) => {
  try {
    const { content, mood = null } = req.body;
    if(!content || !content.trim()) return res.status(400).json({ success:false, message:'content required' });
    const { error } = await supabase.from('anonymous_posts').insert([{ content: content.trim(), mood }]);
    if(error) return res.status(500).json({ success:false, error });
    res.json({ success:true });
  } catch(err){ console.error(err); res.status(500).json({ success:false }); }
});
app.get('/api/treehole', async (req,res) => {
  try {
    const limit = parseInt(req.query.limit || '100', 10);
    const { data, error } = await supabase.from('anonymous_posts').select('*').order('created_at', { ascending:false }).limit(limit);
    if(error) return res.status(500).json({ posts: [] });
    res.json({ posts: data || [] });
  } catch(err){ console.error(err); res.status(500).json({ posts: [] }); }
});

// Counseling
app.post('/api/counseling', async (req,res) => {
  try {
    const { question, locale = 'en-US', user_id = null } = req.body;
    if(!question || !question.trim()) return res.status(400).json({ success:false, message:'question required' });

    const systemPrompt = `
You are a supportive counselor. Provide an empathetic reply (2-4 sentences), 2-3 simple coping suggestions, and crisis guidance line.
Locale: ${locale}
`;
    const completion = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [{ role:'system', content: systemPrompt }, { role:'user', content: question }],
      max_tokens: 350
    });
    const reply = completion.data.choices[0].message.content.trim();

    await supabase.from('chat_messages').insert([{ id: uuidv4(), role_id: null, user_id: user_id || null, sender: 'user', message: question }]).catch(()=>{});
    await supabase.from('chat_messages').insert([{ id: uuidv4(), role_id: null, user_id: user_id || null, sender: 'bot', message: reply }]).catch(()=>{});

    res.json({ success:true, reply });
  } catch(err){ console.error(err); res.status(500).json({ success:false, message:'Counseling failed' }); }
});

// subscription status
app.get('/api/subscription-status', async (req,res) => {
  try {
    const { userId } = req.query;
    if(!userId) return res.json({ active:false });
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId).order('expires_at', { ascending:false }).limit(1).single();
    if(!data) return res.json({ active:false });
    res.json({ active: data.is_active, plan: data.plan, expires_at: data.expires_at });
  } catch(err){ console.error(err); res.status(500).json({ active:false }); }
});

// Stripe (optional)
if(stripe){
  app.post('/api/create-checkout-session', async (req,res) => {
    try {
      const { userId, priceId, successUrl, cancelUrl } = req.body;
      if(!userId || !priceId) return res.status(400).json({ error:'missing' });
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { userId }
      });
      res.json({ url: session.url, sessionId: session.id });
    } catch(err){ console.error(err); res.status(500).json({ error:'stripe' }); }
  });

  app.post('/api/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req,res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try{
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch(err){ console.error('Webhook error', err.message); return res.status(400).send(`Webhook Error: ${err.message}`); }

    if(event.type === 'checkout.session.completed'){
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if(userId){
        const expiresAt = new Date(Date.now() + 7*24*3600*1000).toISOString();
        await supabase.from('subscriptions').insert([{ id: uuidv4(), user_id: userId, plan:'weekly', price:null, expires_at: expiresAt, is_active:true }]).catch(e=>console.error(e));
      }
    }
    res.json({ received:true });
  });
}

app.use((req,res)=> res.status(404).json({ error:'not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`✅ Backend running on ${PORT}`));
// ---------- START: Real Companions / Chat Requests API ----------
// Requires: supabase client (createClient) already configured as `supabase`
// Assumes you already have `app` (express), bodyParser, etc.

const MEMBER_GRACE_CHECK = async (userId) => {
  if (!userId) return false;
  const { data } = await supabase.from('users').select('membership_expires_at').eq('id', userId).single();
  if (!data?.membership_expires_at) return false;
  return new Date(data.membership_expires_at) > new Date();
};

// Middleware to require membership for certain routes (backend guard)
async function requireMember(req, res, next) {
  try {
    // Expect frontend to send userId (or Authorization header and verify token)
    const userId = req.body.user_id || req.query.userId || (req.headers['x-user-id'] || null);
    if (!userId) return res.status(401).json({ error: 'login_required', message: 'Please login' });
    const ok = await MEMBER_GRACE_CHECK(userId);
    if (!ok) return res.status(403).json({ error: 'membership_required', message: 'This feature is for members only' });
    req.authUserId = userId;
    next();
  } catch (err) {
    console.error('requireMember error', err);
    res.status(500).json({ error: 'internal' });
  }
}

// 1) List companions (public)
app.get('/api/companions', async (req, res) => {
  try {
    const { data, error } = await supabase.from('companions').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error });
    res.json({ companions: data });
  } catch (err) { console.error(err); res.status(500).json({ error: 'unexpected' }); }
});

// 2) Create companion (admin/owner) - optional (protect this endpoint in production)
app.post('/api/companions', async (req, res) => {
  try {
    const { name, avatar_url, specialization, languages = [], price = null, contact = null, owner_user_id = null } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const { data, error } = await supabase.from('companions').insert([{
      name, avatar_url, specialization, languages, price, contact, owner_user_id
    }]).select().single();
    if (error) return res.status(500).json({ error });
    res.json({ companion: data });
  } catch (err) { console.error(err); res.status(500).json({ error: 'unexpected' }); }
});

// 3) Submit a chat request (custom companion request) - member only
app.post('/api/chat-requests', requireMember, async (req, res) => {
  try {
    const { style, language, gender_pref, request_text, contact } = req.body;
    const user_id = req.authUserId;
    // server-side check: require request_text and confirm user agreed to legal terms (frontend should confirm)
    if (!request_text || request_text.trim().length < 3) return res.status(400).json({ error: 'request_text required' });

    const { data, error } = await supabase.from('chat_requests').insert([{
      user_id, style, language, gender_pref, request_text, contact, status: 'pending'
    }]).select().single();

    if (error) return res.status(500).json({ error });
    // optionally notify companions / admin (email/webhook) - left for integration
    res.json({ request: data });
  } catch (err) { console.error(err); res.status(500).json({ error: 'unexpected' }); }
});

// 4) Companion fetches pending requests (companion must be authenticated on platform) - show only pending
app.get('/api/chat-requests', async (req, res) => {
  try {
    // Optionally can filter by status, or by companion's language capabilities
    const { status = 'pending', language } = req.query;
    let q = supabase.from('chat_requests').select('*').eq('status', status).order('created_at', { ascending: true });
    if (language) q = q.ilike('language', `%${language}%`);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error });
    res.json({ requests: data });
  } catch (err) { console.error(err); res.status(500).json({ error: 'unexpected' }); }
});

// 5) Companion accepts a request (companion id provided) - mark accepted_by and status=accepted
app.post('/api/chat-requests/:id/accept', async (req, res) => {
  try {
    const { id } = req.params;
    const { companion_id } = req.body;
    if (!companion_id) return res.status(400).json({ error: 'companion_id required' });

    // Update request
    const { data, error } = await supabase.from('chat_requests').update({
      status: 'accepted', accepted_by: companion_id
    }).eq('id', id).select().single();

    if (error) return res.status(500).json({ error });
    // Optionally notify user (email/DM) — left to integrate
    res.json({ request: data });
  } catch (err) { console.error(err); res.status(500).json({ error: 'unexpected' }); }
});

// 6) Companion/owner can mark request completed or cancelled
app.post('/api/chat-requests/:id/update', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['accepted','completed','cancelled'].includes(status)) return res.status(400).json({ error: 'invalid status' });
    const { data, error } = await supabase.from('chat_requests').update({ status }).eq('id', id).select().single();
    if (error) return res.status(500).json({ error });
    res.json({ request: data });
  } catch (err) { console.error(err); res.status(500).json({ error: 'unexpected' }); }
});

// ---------- END: Real Companions / Chat Requests API ----------