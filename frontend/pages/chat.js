import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const roleId = 'replace-with-ai-role-id';
  const userId = 'replace-with-user-id';

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = { sender: 'user', text: input };
    setMessages([...messages, msg]);
    setInput('');
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
      message: msg.text, roleId, user_id: userId
    });
    setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
  };

  return (
    <div className="chat-page">
      <header className="chat-header">💬 Chat Room</header>
      <div className="chat-box">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.sender}`}>
            <img src={m.sender === 'ai' ? '/ai-avatar.png' : '/user-avatar.png'} alt="avatar" className="avatar"/>
            <div className="msg">{m.text}</div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}