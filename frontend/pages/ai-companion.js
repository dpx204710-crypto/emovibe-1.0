import { useState, useEffect } from 'react';
import { supabase } from './_app';
import Header from '../components/Header';
import axios from 'axios';

export default function AICompanion() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [aiRole, setAiRole] = useState({ name: '', personality: '', catchphrase: '', interests: '' });
  const [input, setInput] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || '';

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
      setChatLog([...newChat, { sender: 'ai', text: res.data.reply || '...' }]);
    } catch {
      setChatLog([...newChat, { sender: 'ai', text: 'Error connecting to AI.' }]);
    }
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '700px', margin: '100px auto', padding: '20px' }}>
        <h1 style={{ color: '#28a745' }}>AI Custom Companion</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <input placeholder="AI Name" value={aiRole.name} onChange={e => setAiRole({ ...aiRole, name: e.target.value })} />
          <input placeholder="Personality" value={aiRole.personality} onChange={e => setAiRole({ ...aiRole, personality: e.target.value })} />
          <input placeholder="Catchphrase" value={aiRole.catchphrase} onChange={e => setAiRole({ ...aiRole, catchphrase: e.target.value })} />
          <input placeholder="Interests" value={aiRole.interests} onChange={e => setAiRole({ ...aiRole, interests: e.target.value })} />
        </div>

        <div style={{ border: '1px solid #ddd', borderRadius: '8px', marginTop: '20px', padding: '15px', minHeight: '300px', background: '#f9f9f9' }}>
          {chatLog.map((c, i) => (
            <div key={i} style={{ textAlign: c.sender === 'user' ? 'right' : 'left', margin: '8px 0' }}>
              <b>{c.sender === 'user' ? 'You' : aiRole.name || 'AI'}:</b> {c.text}
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." style={{ flex: 1 }} />
          <button type="submit" style={{ background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', padding: '10px 20px' }}>Send</button>
        </form>
      </main>
    </div>
  );
}