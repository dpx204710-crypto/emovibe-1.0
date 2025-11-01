// frontend/pages/chat.js
import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]); // 聊天记录
  const [input, setInput] = useState('');       // 用户输入
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息函数
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });
      const data = await res.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: '服务器错误，请稍后重试。' }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 处理回车发送
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>聊天室</h1>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px', height: '400px', overflowY: 'auto', marginBottom: '10px', backgroundColor: '#f5faff' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              backgroundColor: msg.sender === 'user' ? '#007bff' : '#e0f0ff',
              color: msg.sender === 'user' ? 'white' : '#007bff'
            }}>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="输入消息..."
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ marginLeft: '10px', padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </div>
    </div>
  );
}