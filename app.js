<script type="module">
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://你的项目地址.supabase.co'
const SUPABASE_KEY = '你的anon公钥'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 登录函数
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) alert(error.message)
  else window.location = data.user.user_metadata.role === 'client' ? 'client.html' : 'companion.html'
}

// 注册函数
export async function register(email, password, name, gender, role) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { name, gender, role } }
  })
  if (error) alert(error.message)
  else alert("注册成功，请登录")
}

// 下单函数
export async function createRequest(gender_preference, style_preference) {
  const user = (await supabase.auth.getUser()).data.user
  const { error } = await supabase.from('requests').insert({
    client_id: user.id,
    gender_preference,
    style_preference
  })
  if (error) alert(error.message)
  else alert("下单成功，等待陪聊师接单")
}

// 获取待接单请求（陪聊师用）
export async function getPendingRequests() {
  const { data } = await supabase.from('requests').select('*').eq('status', 'pending')
  return data
}

// 接单
export async function acceptRequest(requestId) {
  const { error } = await supabase.from('requests').update({ status: 'accepted' }).eq('id', requestId)
  if (error) alert(error.message)
  else window.location = `chat.html?room=${requestId}`
}

// 发送消息
export async function sendMessage(roomId, receiverId, content) {
  const user = (await supabase.auth.getUser()).data.user
  await supabase.from('messages').insert({
    room_id: roomId,
    sender_id: user.id,
    receiver_id: receiverId,
    content
  })
}

// 监听消息
export function listenMessages(roomId, callback) {
  supabase
    .channel('chat-room')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
      payload => callback(payload.new))
    .subscribe()
}
</script>
