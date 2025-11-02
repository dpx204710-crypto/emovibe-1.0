import { useState } from 'react';
import axios from 'axios';
import { supabase } from './_app';
import { useRouter } from 'next/router';

export default function AICreate(){
  const [form,setForm] = useState({ name:'', personality:'', catchphrase:'', interests:'', avatar_url:'' });
  const [loading,setLoading] = useState(false);
  const router = useRouter();

  const autopop = () => {
    const seed = encodeURIComponent(form.name || 'companion-' + Math.floor(Math.random()*9999));
    setForm(f=>({...f, avatar_url:`https://api.dicebear.com/6.x/pixel-art/png?seed=${seed}`}));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null;
    const owner_id = user?.id || null;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles`, {
        owner_id,
        name: form.name,
        personality: form.personality,
        catchphrase: form.catchphrase,
        interests: form.interests ? form.interests.split(',').map(s=>s.trim()) : [],
        avatar_url: form.avatar_url
      });
      if (res.data.success) {
        router.push(`/chat?roleId=${res.data.roleId}&userId=${owner_id || ''}`);
      } else alert('Create failed');
    } catch (err) {
      console.error(err);
      alert('Server error');
    } finally { setLoading(false); }
  };

  return (
    <div className="container" style={{paddingTop:34}}>
      <div className="card" style={{maxWidth:720,margin:'0 auto'}}>
        <h2>Create AI Companion</h2>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{width:'100%',padding:8,margin:'8px 0'}}/>
        <input placeholder="Personality" value={form.personality} onChange={e=>setForm({...form,personality:e.target.value})} style={{width:'100%',padding:8,margin:'8px 0'}}/>
        <input placeholder="Catchphrase" value={form.catchphrase} onChange={e=>setForm({...form,catchphrase:e.target.value})} style={{width:'100%',padding:8,margin:'8px 0'}}/>
        <input placeholder="Interests (comma separated)" value={form.interests} onChange={e=>setForm({...form,interests:e.target.value})} style={{width:'100%',padding:8,margin:'8px 0'}}/>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <input placeholder="Avatar URL (optional)" value={form.avatar_url} onChange={e=>setForm({...form,avatar_url:e.target.value})} style={{flex:1,padding:8}}/>
          <button className="btn btn-ghost" onClick={autopop}>Auto</button>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading?'Creating...':'Create & Chat'}</button>
        </div>
      </div>
    </div>
  );
}