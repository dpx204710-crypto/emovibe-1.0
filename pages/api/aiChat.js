import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://lryfufidcxnxdzglbzgq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU'
);

export default function AiChat() {
  const [user, setUser] = useState(null);
  const [aiCharacter, setAiCharacter] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [coins, setCoins] = useState(0);
  const [creating, setCreating] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user_id');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  async function handleCreateCharacter(e) {
    e.preventDefault();
    setCreating(true);

    const name = e.target.name.value;
    const personality = e.target.personality.value;
    const style = e.target.style.value;

    let avatarUrl = null;

    if (avatar) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`ai_${Date.now()}.png`, avatar);

      if (error) {
        console.error(error);
        alert('Avatar upload failed.');
      } else {
        const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(data.path);
        avatarUrl = publicUrl.publicUrl;
      }
    }

    const { data, error } = await supabase
      .from('ai_characters')
      .insert([{ name, personality, style, coins: 100, avatar_url: avatarUrl }])
      .select();

    if (error) alert('Error creating character');
    else {
      setAiCharacter(data[0]);
      setCoins(data[0].coins);
    }
    setCreating(false);
  }

  async function sendMessage() {
    if (!message.trim()) return;

    const res = await fetch('/api/aiChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user || 'guest',
        ai_id: aiCharacter.id,
        message,
      }),
    });

    const data = await res.json();
    setChat([...chat, { role: 'user', content: message }, { role: 'ai', content: data.reply }]);
    setCoins(coins + data.reward);
    setMessage('');
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>✨ AI Custom Companion</h1>

      {!aiCharacter ? (
        <form onSubmit={handleCreateCharacter} style={styles.form}>
          <input name="name" placeholder="Character Name" required style={styles.input} />
          <input name="personality" placeholder="Personality (e.g. kind, funny)" required style={styles.input} />
          <input name="style" placeholder="Chat Style (e.g. sweet, calm)" required style={styles.input} />

          <label style={styles.label}>Upload Avatar (optional):</label>
          <input type="file" accept="image/*" onChange={handleAvatarChange} style={styles.file} />
          {avatarPreview && <img src={avatarPreview} alt="preview" style={styles.avatarPreview} />}

          <button style={styles.button} disabled={creating}>
            {creating ? 'Creating...' : 'Create Character'}
          </button>
        </form>
      ) : (
        <>
          <div style={styles.characterBox}>
            {aiCharacter.avatar_url && (
              <img src={aiCharacter.avatar_url} alt="avatar" style={styles.avatar} />
            )}
            <h2>{aiCharacter.name}</h2>
            <p>💬 {aiCharacter.personality}</p>
            <p>🪙 Coins: {coins}</p>
          </div>

          <div style={styles.chatBox}>
            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.message,
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' ? '#ffe57f' : '#fff5cc',
                }}
              >
                <b>{msg.role === 'user' ? 'You' : aiCharacter.name}:</b> {msg.content}
              </div>
            ))}
          </div>

          <div style={styles.inputBox}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.button}>Send</button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    background: 'linear-gradient(to bottom, #fff9e6, #ffedb3)',
    minHeight: '100vh',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Poppins, sans-serif',
  },
  title: {
    color: '#f5b400',
    fontSize: '2em',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '320px',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    border: '1px solid #f0c86d',
    borderRadius: '8px',
    outline: 'none',
    width: '100%',
  },
  file: {
    background: '#fff8db',
    padding: '8px',
    borderRadius: '6px',
  },
  label: {
    fontSize: '0.9em',
    color: '#555',
  },
  button: {
    background: '#ffca28',
    color: '#fff',
    border: 'none',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  chatBox: {
    width: '100%',
    maxWidth: '600px',
    background: '#fff7d1',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    height: '400px',
    overflowY: 'auto',
    marginTop: '20px',
  },
  message: {
    padding: '10px 15px',
    borderRadius: '12px',
    maxWidth: '70%',
    fontSize: '0.95em',
  },
  inputBox: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
    width: '100%',
    maxWidth: '600px',
  },
  characterBox: {
    background: '#fff6c8',
    borderRadius: '12px',
    padding: '15px',
    width: '300px',
    textAlign: 'center',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    marginBottom: '10px',
    objectFit: 'cover',
    border: '2px solid #ffca28',
  },
  avatarPreview: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginTop: '10px',
    objectFit: 'cover',
    border: '1px solid #f0c86d',
  },
};