// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const { Configuration, OpenAIApi } = require('openai');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Configure CORS: adjust FRONTEND_HOST in .env for production
const FRONTEND_HOST = process.env.FRONTEND_HOST || 'http://localhost:3000';
app.use(cors({ origin: [FRONTEND_HOST] }));

// Supabase and OpenAI clients
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_KEY in env');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('Missing OPENAI_API_KEY in env');
  process.exit(1);
}
const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_KEY }));

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Create AI role
app.post('/api/ai-roles', async (req, res) => {
  try {
    const { user_id = 'demo_user', name, personality, catchphrase = null, interests = [], avatar_url = null } = req.body;
    if (!name || !personality) return res.status(400).json({ success: false, message: 'name & personality required' });

    const roleId = uuidv4();
    const payload = { id: roleId, user_id: String(user_id), name, personality, catchphrase, interests, avatar_url };
    const { error } = await supabase.from('ai_roles').insert([payload]);
    if (error) {
      console.error('supabase insert role error', error);
      return res.status(500).json({ success: false, error });
    }
    return res.json({ success: true, roleId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'server error' });
  }
});

// Get role
app.get('/api/ai-roles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('ai_roles').select('*').eq('id', id).single();
    if (error || !data) return res.status(404).json({ success: false, message: 'Role not found' });
    return res.json({ role: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

// Chat endpoint (uses OpenAI)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, roleId, user_id = 'demo_user' } = req.body;
    if (!message || !roleId) return res.status(400).json({ reply: 'message & roleId required' });

    const { data: roleData } = await supabase.from('ai_roles').select('*').eq('id', roleId).single();
    if (!roleData) return res.status(400).json({ reply: 'Role not found' });

    const systemPrompt = `
You are an empathetic AI companion that MUST reply in the style below.
Role name: ${roleData.name}
Personality: ${roleData.personality}
Catchphrase: ${roleData.catchphrase || 'N/A'}
Interests: ${roleData.interests ? roleData.interests.join(', ') : 'N/A'}
Reply to the user's message concisely (~1-3 sentences), friendly, emotionally appropriate.
`;

    const userContent = `User: ${message}`;

    // OpenAI ChatCompletion
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent }
      ],
      max_tokens: 250,
    });

    const reply = completion.data.choices[0].message.content.trim();

    // persist both user and bot messages
    await supabase.from('chat_messages').insert([
      { id: uuidv4(), role_id: roleId, user_id: String(user_id), sender: 'user', message },
      { id: uuidv4(), role_id: roleId, user_id: String(user_id), sender: 'bot', message: reply }
    ]);

    return res.json({ reply });
  } catch (err) {
    console.error('chat error', err);
    return res.status(500).json({ reply: 'AI reply failed' });
  }
});

// Chat history
app.get('/api/chat-history', async (req, res) => {
  try {
    const { roleId, userId } = req.query;
    if (!roleId || !userId) return res.status(400).json({ messages: [] });
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('role_id', roleId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error });
    return res.json({ messages: data || [] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ messages: [] });
  }
});

// subscription status
app.get('/api/subscription-status', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.json({ active: false });
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId).order('end_date', { ascending: false }).limit(1).single();
    if (!data) return res.json({ active: false });
    return res.json({ active: data.status === 'active', plan: data.plan, end_date: data.end_date });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ active: false });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));