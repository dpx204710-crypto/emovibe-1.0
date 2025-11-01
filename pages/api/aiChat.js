import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lryfufidcxnxdzglbzgq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU'
);

// Basic AI message handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { user_id, ai_id, message } = req.body;

  if (!user_id || !ai_id || !message) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  // Save user message
  await supabase.from('ai_messages').insert([
    { user_id, ai_id, role: 'user', content: message }
  ]);

  // Simple AI reply (you can later replace this with OpenAI API)
  const aiReply = `💬 ${message}? That’s interesting! Tell me more about it.`;

  // Save AI reply
  await supabase.from('ai_messages').insert([
    { user_id, ai_id, role: 'ai', content: aiReply, reward: 1 }
  ]);

  // Add coin reward
  await supabase.rpc('increment', { x: 0, step: 1 });

  res.status(200).json({
    reply: aiReply,
    reward: 1,
  });
}