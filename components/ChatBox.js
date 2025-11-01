import { useState, useEffect } from 'react';
import { fetchMessages, sendMessage } from '../utils/api';

export default function ChatBox({ chatId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const interval = setInterval(async () => {
      const newMessages = await fetchMessages(chatId);
      setMessages(newMessages);
    }, 1000);
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSend = async () => {
    if (!input) return;
    await sendMessage(chatId, user.id, input);
    setInput('');
  };

  return (
    <div className="p-4 bg-white rounded shadow h-96 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-1 ${msg.userId === user.id ? 'text-right' : 'text-left'}`}>
            <span className="inline-block p-2 rounded bg-blue-100">{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
}
