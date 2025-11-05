import { useState, useEffect } from 'react';
import { supabase } from './_app';
import Header from '../components/Header';
import axios from 'axios';

export default function CustomChat() {
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    gender: '',
    personality: '',
    description: '',
    contact: ''
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    })();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      setMsg('Please log in first.');
      return;
    }

    try {
      await axios.post(`${API}/custom-request`, {
        user_id: user.id,
        ...form
      });
      setMsg('Your request has been submitted!');
      setForm({ gender: '', personality: '', description: '', contact: '' });
    } catch (err) {
      setMsg('Error submitting.');
    }
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '600px', margin: '100px auto', padding: '20px' }}>
        <h1 style={{ color: '#007bff' }}>Custom Real Chat Companion</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="text" placeholder="Preferred Gender" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />
          <input type="text" placeholder="Personality" value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })} />
          <textarea placeholder="Other requirements" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          <input type="text" placeholder="Contact Info (optional)" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
          <button type="submit" style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', padding: '12px' }}>Submit</button>
        </form>
        {msg && <p style={{ marginTop: '20px', color: '#007bff' }}>{msg}</p>}
      </main>
    </div>
  );
}