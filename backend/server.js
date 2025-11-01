import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 1️⃣ Register
app.post('/register', async (req, res) => {
  const { email, password, name, country, gender } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password_hash: hashedPassword, name, country, gender, role: 'user' }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Registration successful', user: data[0] });
});

// 2️⃣ Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.status(401).json({ error: 'Incorrect password' });

  res.json({ message: 'Login success', user });
});

// 3️⃣ Chat API
app.post('/chat', async (req, res) => {
  const { chat_id, user_id, text, type } = req.body;
  const { data, error } = await supabase.from('messages').insert([{ chat_id, user_id, text, type }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// 4️⃣ Tree Hole API
app.get('/tree_holes', async (req, res) => {
  const { data, error } = await supabase.from('tree_holes').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/tree_holes', async (req, res) => {
  const { user_id, content } = req.body;
  const { data, error } = await supabase.from('tree_holes').insert([{ user_id, content, anonymous: true }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

app.listen(process.env.PORT || 3000, () => console.log('Server running'));
