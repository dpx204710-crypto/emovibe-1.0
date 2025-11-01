import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lryfufidcxnxdzglbzgq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU'

const supabase = createClient(supabaseUrl, supabaseKey)

// ✅ 获取当前用户
export async function getUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

// ✅ 获取余额
export async function getBalance() {
  const user = await getUser()
  if (!user) return 0
  const { data } = await supabase
    .from('users_coins')
    .select('balance')
    .eq('owner_id', user.id)
    .single()
  return data?.balance || 0
}

// ✅ 创建AI角色
export async function createAICharacter(name, personality, avatar_url) {
  const user = await getUser()
  if (!user) {
    alert('请先登录')
    return
  }
  const { error } = await supabase
    .from('ai_characters')
    .insert([{ user_id: user.id, name, personality, avatar_url }])
  if (error) alert('Error: ' + error.message)
  else alert('AI角色创建成功！')
}

// ✅ 获取当前用户的角色列表
export async function getMyCharacters() {
  const user = await getUser()
  const { data } = await supabase
    .from('ai_characters')
    .select('*')
    .eq('user_id', user.id)
  return data || []
}

// ✅ 发送AI聊天 + 加币
export async function sendAIMessage(character_id, content) {
  const user = await getUser()

  await supabase.from('ai_messages').insert([
    { user_id: user.id, character_id, role: 'user', content },
  ])

  const reply = `AI：${content} ❤️`
  await supabase.from('ai_messages').insert([
    { user_id: user.id, character_id, role: 'ai', content: reply },
  ])

  await supabase.rpc('update_balance', { user_id: user.id, amount_change: 5 })
  return reply
}