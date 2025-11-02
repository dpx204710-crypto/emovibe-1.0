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

// Stripe needs raw body for webhook; we'll mount JSON parser for normal routes and raw for webhook
app.use(cors({ origin: process.env.FRONTEND_HOST || 'http://localhost:3000' }));
app.use(bodyParser.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

const STRIPE_SECRET = process.env.STRIPE_SECRET; // set if using Stripe
const stripe = STRIPE_SECRET ? Stripe(STRIPE_SECRET) : null;

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Create an AI role
app.post('/api/ai-roles', async (req, res) => {
  try {
    const { owner_id = null, name, personality, catchphrase = null, interests = [], avatar_url = null } = req.body;
    if (!name || !personality) return res.status(400).json({ success: false, message: 'name & personality required' });

    const roleId = uuidv4();
    const payload = { id: roleId, owner_id, name, personality, catchphrase, interests, avatar_url };
    const { error } = await supabase.from('ai_roles').insert([payload]);
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ success: true, roleId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Get role by id
app.get('/api/ai-roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('ai_roles').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ success: false, message: 'Role not found' });
    res.json({ role: data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// List roles by owner (optional query)
app.get('/api/ai-roles', async (req, res) => {
  try {
    const { ownerId } = req.query;
    let q = supabase.from('ai_roles').select('*');
    if (ownerId) q = q.eq('owner_id', ownerId);
    const { data, error } = await q;
    if (error) return res.status(500).json({ success: false, error });
    return res.json({ roles: data });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Chat endpoint (calls OpenAI)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, roleId, user_id } = req.body;
    if (!message || !roleId) return res.status(400).json({ reply: 'message & roleId required' });

    const { data: roleData, error: roleErr } = await supabase.from('ai_roles').select('*').eq('id', roleId).single();
    if (roleErr || !roleData) return res.status(400).json({ reply: 'Role not found' });

    // Compose prompt for OpenAI
    const systemPrompt = `
You are an empathetic AI companion. Use the role information below to style replies.

Role:
Name: ${roleData.name}
Personality: ${roleData.personality}
Catchphrase: ${roleData.catchphrase || 'None'}
Interests: ${roleData.interests ? roleData.interests.join(', ') : 'None'}

User message: "${message}"

Reply concisely (1-3 sentences), supportive and friendly.
`;

    // Call OpenAI (non-streaming). For streaming, see notes below.
    const completion = await openai.createChatCompletion({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 250
    });

    const reply = completion.data.choices[0].message.content.trim();

    // Save messages
    await supabase.from('chat_messages').insert([
      { id: uuidv4(), role_id: roleId, user_id: user_id || null, sender: 'user', message },
      { id: uuidv4(), role_id: roleId, user_id: user_id || null, sender: 'bot', message: reply }
    ]);

    res.json({ reply });
  } catch (err) {
    console.error('chat error', err);
    res.status(500).json({ reply: 'AI reply failed' });
  }
});

// Get chat history
app.get('/api/chat-history', async (req, res) => {
  try {
    const { roleId, userId } = req.query;
    if (!roleId || !userId) return res.status(400).json({ messages: [] });
    const { data, error } = await supabase.from('chat_messages').select('*').eq('role_id', roleId).eq('user_id', userId).order('created_at', { ascending: true });
    if (error) return res.status(500).json({ messages: [] });
    res.json({ messages: data });
  } catch (err) {
    res.status(500).json({ messages: [] });
  }
});


// ========== Stripe Checkout (optional) ==========
if (stripe) {
  // Create Checkout Session for subscription
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { userId, priceId, successUrl, cancelUrl } = req.body;
      if (!userId || !priceId) return res.status(400).json({ error: 'missing fields' });

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { userId }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
      console.error('stripe session', err);
      res.status(500).json({ error: 'stripe error' });
    }
  });

  // Stripe webhook for subscription events
  app.post('/api/stripe-webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      // find subscription and mark active in supabase
      const subId = uuidv4();
      const start = new Date().toISOString();
      // if you want, set end_date based on price plan
      await supabase.from('subscriptions').insert([
        { id: subId, user_id: userId, plan: 'weekly', start_date: start, end_date: new Date(Date.now() + 7*24*3600*1000).toISOString(), status: 'active' }
      ]);
    }

    res.json({ received: true });
  });
}

// Fallback
app.use((req, res) => res.status(404).json({ error: 'not found' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));