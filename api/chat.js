// chat.js
import { supabase } from './assets/supabase.js';

// 页面元素
const listenersEl = document.getElementById('listeners');
const userInfoEl = document.getElementById('userInfo');
const sessionArea = document.getElementById('sessionArea');
const chatWindow = document.getElementById('chatWindow');
const textInput = document.getElementById('text');
const sendBtn = document.getElementById('sendBtn');
const sessionTitle = document.getElementById('sessionTitle');

let currentUser = null;
let currentRequest = null; // 记录当前客户的 request (当陪聊师接单后)
let currentCompanion = null; // 记录被接单的陪聊师

async function loadUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    // 未登录跳回 login 页面
    window.location.href = 'login.html';
    return;
  }
  currentUser = user;
  userInfoEl.innerHTML = `<div>你好，${user.email || user.user_metadata?.full_name || '用户'}</div>`;
}

async function loadListeners(){
  // 读取 profiles 表中 role = 'listener' 且 online = true 的陪聊师
  const { data, error } = await supabase
    .from('profiles')
    .select('id, nickname, bio, online')
    .eq('role','listener')
    .eq('online', true);

  if (error) {
    listenersEl.innerText = '载入陪聊师失败';
    console.error(error);
    return;
  }
  listenersEl.innerHTML = '';
  data.forEach(l=>{
    const el = document.createElement('div');
    el.className = 'listener-card';
    el.innerHTML = `<strong>${l.nickname}</strong><div style="font-size:12px;color:#666">${l.bio||''}</div>`;
    el.onclick = ()=> createRequest(l);
    listenersEl.appendChild(el);
  });
}

async function createRequest(listener){
  // 插入 requests：客户下单 -> 陪聊师可接单
  const { data, error } = await supabase
    .from('requests')
    .insert({
      client_id: currentUser.id,
      companion_id: listener.id,
      status: 'pending', // pending -> accepted -> active -> finished
      created_at: new Date()
    }).select().single();

  if (error) {
    alert('下单失败:' + error.message);
    return;
  }
  currentRequest = data;
  alert('已发起请求，等待陪聊师接单');
  // 监听该 request 的变化（被陪聊师接单后打开会话）
  subscribeRequest(data.id);
}

function subscribeRequest(requestId){
  supabase.channel('request-' + requestId)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'requests', filter: `id=eq.${requestId}` }, payload=>{
      const newReq = payload.new;
      if (newReq.status === 'accepted' && newReq.companion_id) {
        currentCompanion = newReq.companion_id;
        startSession(newReq.id);
      }
    }).subscribe();
}

async function startSession(requestId){
  sessionArea.style.display = 'block';
  sessionTitle.innerText = '会话中 — 请求 #' + requestId;
  chatWindow.innerHTML = '';
  // 订阅 messages 表中属于该 request 的消息
  supabase.channel('messages-'+requestId)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `request_id=eq.${requestId}` }, payload=>{
      const m = payload.new;
      appendMsg(m);
    }).subscribe();

  // 加载历史消息
  const { data } = await supabase.from('messages').select('*').eq('request_id', requestId).order('created_at', { ascending: true });
  data.forEach(appendMsg);
}

// 将消息渲染到窗口
function appendMsg(m){
  const d = document.createElement('div');
  d.className = 'msg ' + (m.role === 'client' ? 'user' : 'companion');
  d.innerText = m.content;
  chatWindow.appendChild(d);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// 发送消息（写入 messages）
sendBtn.onclick = async ()=>{
  const text = textInput.value.trim();
  if (!text) return;
  if (!currentRequest) { alert('还没有会话'); return; }
  const { error } = await supabase.from('messages').insert({
    request_id: currentRequest.id,
    role: 'client',
    content: text,
    created_at: new Date()
  });
  if (error) { console.error(error); alert('发送失败'); return; }
  textInput.value = '';
  // 另外：如果需要 AI 回复，可以调用你的后端 /api/chat 并把结果写入 messages（后端会调用 OpenAI）
  // fetch('/api/chat', {method:'POST', body: JSON.stringify({message:text})})
}

window.addEventListener('load', async ()=>{
  await loadUser();
  await loadListeners();
  // 监听整个 messages 表（可用于实时更新陪聊师在线数等）
});