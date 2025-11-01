// pages/api/ai-chat.js
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
// NOTE: 使用 service key 在 server 端访问 db（不要公开）

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { conversationId, characterId, userId, message } = req.body;

  try {
    // 1) 获取角色 prompt
    const { data: charData, error: charErr } = await supabase
      .from('user_ai_characters')
      .select('*')
      .eq('id', characterId)
      .single();
    if (charErr) throw charErr;

    // 2) 拉最近的历史消息（ai_messages）
    const { data: history } = await supabase
      .from('ai_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(30); // 控制上下文长度

    // 3) 构建 messages
    const systemPrompt = charData.prompt || `You are ${charData.name}, ${charData.personality}.`; // fallback
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: message }
    ];

    // 4) 请求 OpenAI
    const resp = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // 或 gpt-4o / gpt-4 等按你权限
        messages,
        max_tokens: 800,
      })
    });

    const data = await resp.json();

    const assistantText = data.choices?.[0]?.message?.content || "(无回复)";

    // 5) 写入 ai_messages（system/user/alignment）
    await supabase.from('ai_messages').insert([
      { conversation_id: conversationId, sender: userId, role: 'user', content: message },
      { conversation_id: conversationId, sender: 'ai', role: 'assistant', content: assistantText }
    ]);

    // 6) 解析是否包含记账/转账指令（可在 prompt 里定义约定）
    // 例如 AI 回复里 meta JSON：{ "action": "record", "amount": 10, "category": "coffee" }
    // 如果需要解析则在此处理 -> 调用 ledger 添加或/and call transfer API

    res.status(200).json({ reply: assistantText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || err });
  }
}
