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
    setForm(f=>({...f, avatar_url:`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const owner_id = userData?.user?.id || null;
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles`, {
        owner_id, name: form.name, personality: form.personality, catchphrase: form.catchphrase,
        interests: form.interests ? form.interests.split(',').map(s=>s.trim()) : [], avatar_url: form.avatar_url
      });
      if (res.data.success) {
        router.push(`/chat?roleId=${res.data.roleId}&userId=${owner_id || ''}`);
      } else alert('Create failed');
    } catch (err) {
      console.error(err); alert('Server error');
    } finally { setLoading(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:720,margin:'24px auto'}}>
        <h2>Create AI Companion / 创建AI陪伴者</h2>
        <input className="form-input" placeholder="Name / 名字" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input className="form-input" placeholder="Personality / 个性 (e.g. calm, cheerful)" value={form.personality} onChange={e=>setForm({...form, personality:e.target.value})} />
        <input className="form-input" placeholder="Catchphrase / 口头禅 (optional)" value={form.catchphrase} onChange={e=>setForm({...form, catchphrase:e.target.value})} />
        <input className="form-input" placeholder="Interests / 兴趣 (comma separated)" value={form.interests} onChange={e=>setForm({...form, interests:e.target.value})} />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <input className="form-input" placeholder="Avatar URL (optional)" value={form.avatar_url} onChange={e=>setForm({...form, avatar_url:e.target.value})} />
          <button className="btn btn-outline" onClick={autopop}>Auto / 生成</button>
        </div>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create & Chat / 创建并聊天'}</button>
        </div>
      </div>
    </div>
  );
}