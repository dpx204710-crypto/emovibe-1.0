import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// --------------------
// Supabase 初始化
// --------------------
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// --------------------
// 注册 API
// --------------------
app.post('/register', async (req, res) => {
  const { email, password, name, country, gender } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase.from('users')
    .insert([{ id: uuidv4(), email, password_hash: hashedPassword, name, country, gender, role:'user' }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Registration successful', user: data[0] });
});

// --------------------
// 登录 API
// --------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: user } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user) return res.status(404).json({ error: 'User not found' });

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return res.status(401).json({ error: 'Incorrect password' });

  res.json({ message: 'Login success', user });
});

// --------------------
// 聊天 API
// --------------------
app.post('/chat', async (req, res) => {
  const { chat_id, user_id, text, type } = req.body;
  const { data, error } = await supabase.from('messages')
    .insert([{ id: uuidv4(), chat_id, user_id, text, type }])
    .select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// --------------------
// 树洞 API
// --------------------
app.get('/tree_holes', async (req, res) => {
  const { data, error } = await supabase.from('tree_holes').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

app.post('/tree_holes', async (req, res) => {
  const { user_id, content } = req.body;
  const { data, error } = await supabase.from('tree_holes')
    .insert([{ id: uuidv4(), user_id, content, anonymous: true }]).select();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data[0]);
});

// --------------------
// 会员 API
// --------------------
app.post('/membership', async (req, res) => {
  const { user_id, type, price } = req.body;
  const end_date = new Date();
  if(type === 'weekly') end_date.setDate(end_date.getDate()+7);
  if(type === 'monthly') end_date.setMonth(end_date.getMonth()+1);

  const { data, error } = await supabase.from('memberships')
    .insert([{ id: uuidv4(), user_id, type, start_date: new Date(), end_date, price, status:'active' }]).select();
  if(error) return res.status(400).json({error:error.message});
  res.json(data[0]);
});

// --------------------
// 启动服务器
// --------------------
app.listen(process.env.PORT || 3000, ()=>console.log('Backend running on port', process.env.PORT||3000));