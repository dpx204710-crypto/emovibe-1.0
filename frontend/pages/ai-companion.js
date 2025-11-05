// frontend/pages/ai-companion.js
import { useState, useEffect } from 'react';
import { supabase } from './_app';
import Header from '../components/Header';
import axios from 'axios';

export default function AICompanion() {
  const [user, setUser] = useState(null);
  const [locale, setLocale] = useState('en');
  const [msg, setMsg] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [aiRole, setAiRole] = useState({
    name: '',
    personality: '',
    catchphrase: '',
    interests: ''
  });
  const [input, setInput] = useState('');
  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const t = (en, zh) => (locale === 'en' ? en : zh);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    })();
  }, []);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newChat = [...chatLog, { sender: 'user', text: input }];
    setChatLog(newChat);
    setInput('');

    try {
      const res = await axios.post(`${API}/ai-chat`, {
        user_id: user?.id,
        message: input,
        ai_role: aiRole
      });
      const reply = res.data.reply || '...';
      setChatLog([...newChat, { sender: 'ai', text: reply }]);
    } catch {
      setChatLog([...newChat, { sender: 'ai', text: t('Error connecting to AI.', 'AI连接出错。') }]);
    }
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '700px', margin: '80px auto', padding: '20px' }}>
        <h1 style={{ color: '#007bff' }}>{t('AI Custom Companion', 'AI自定义陪聊')}</h1>
        <p>{t('Create your own AI companion. Define their traits and start chatting instantly.', '创建你的专属AI陪聊角色，定义性格与口头禅，立即开始聊天。')}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <input placeholder={t('AI Name', 'AI名称')} value={aiRole.name} onChange={e => setAiRole({ ...aiRole, name: e.target.value })} />
          <input placeholder={t('Personality', '性格')} value={aiRole.personality} onChange={e => setAiRole({ ...aiRole, personality: e.target.value })} />
          <input placeholder={t('Catchphrase', '口头禅')} value={aiRole.catchphrase} onChange={e => setAiRole({ ...aiRole, catchphrase: e.target.value })} />
          <input placeholder={t('Interests', '兴趣爱好')} value={aiRole.interests} onChange={e => setAiRole({ ...aiRole, interests: e.target.value })} />
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', padding: '15px', minHeight: '300px', background: '#f9f9f9' }}>
          {chatLog.map((c, i) => (
            <div key={i} style={{ textAlign: c.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
              <b>{c.sender === 'user' ? t('You', '你') : aiRole.name || 'AI'}:</b> {c.text}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('Type your message...', '输入你的消息...')} style={{ flex: 1 }} />
          <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px' }}>{t('Send', '发送')}</button>
        </form>
      </main>
    </div>
  );
}
