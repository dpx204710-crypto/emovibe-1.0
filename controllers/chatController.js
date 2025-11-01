import supabase from '../utils/supabaseClient.js';

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

export async function postMessage(req, res) {
  const { chatId } = req.params;
  const { userId, text } = req.body;
  const { data, error } = await supabase
    .from('messages')
    .insert([{ chat_id: chatId, user_id: userId, text }])
    .select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
}
