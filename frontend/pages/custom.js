import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function CustomChat() {
  const [form, setForm] = useState({ gender: '', personality: '', contact: '', note: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    alert('Custom order submitted! Our staff will contact you soon.');
  };

  return (
    <div>
      <Navbar />
      <main style={{ textAlign: 'center', padding: '80px' }}>
        <h2>Custom Human Chat Service</h2>
        <p>Define your ideal companion (for chat only, legal behavior only).</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
          <textarea name="gender" placeholder="Describe preferred gender..." onChange={handleChange}></textarea><br />
          <textarea name="personality" placeholder="Describe personality traits..." onChange={handleChange}></textarea><br />
          <input name="contact" placeholder="Your contact info" onChange={handleChange} /><br />
          <textarea name="note" placeholder="Other requests..." onChange={handleChange}></textarea><br />
          <button type="submit">Submit Custom Request</button>
        </form>
      </main>
    </div>
  );
}