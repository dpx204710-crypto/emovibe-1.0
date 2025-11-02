import { useState } from 'react';
import axios from 'axios';

export default function AICreate() {
  const [form, setForm] = useState({ name: '', personality: '', catchphrase: '', interests: '', avatar_url: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles`, {
        user_id: 'replace-with-user-id',
        ...form,
        interests: form.interests.split(',').map(i => i.trim())
      });
      alert(`AI Role Created: ${res.data.roleId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to create role.');
    }
  };

  return (
    <div className="create-page">
      <h2>Create Your AI Companion</h2>
      {['name','personality','catchphrase','interests','avatar_url'].map((field)=>(
        <input key={field} name={field} placeholder={field} onChange={handleChange} />
      ))}
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}