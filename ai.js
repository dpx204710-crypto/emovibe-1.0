import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lryfufidcxnxdzglbzgq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU'

const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ 创建AI角色
export async function createAICharacter(name, personality, avatar_url) {
  const user = (await supabase.auth.getUser()).data.user
  const { error } = await supabase
    .from('ai_characters')
    .insert([{ user_id: user.id, name, personality, avatar_url }])
  if (error) alert('Error: ' + error.message)
  else alert('AI角色创建成功！')
}

// ✅ 发送消息 + 增加5币
export async function sendAIMessage(character_id, content) {
  const user = (await supabase.auth.getUser()).data.user

  // 插入用户消息
  await supabase.from('ai_messages').insert([{ user_id: user.id, character_id, role: 'user', content }])

  // 模拟AI回复（后续可改为调用模型API）
  const reply = `AI: ${content} ❤️`
  await supabase.from('ai_messages').insert([{ user_id: user.id, character_id, role: 'ai', content: reply }])

  // 每条消息 +5币
  await supabase.rpc('update_balance', { user_id: user.id, amount_change: 5 })
  return reply
}
