import { useState } from 'react';
import axios from 'axios';

export default function AICreate() {
  const [name,setName]=useState('');
  const [personality,setPersonality]=useState('');
  const [catchphrase,setCatchphrase]=useState('');
  const [interests,setInterests]=useState('');
  const [avatar,setAvatar]=useState('');

  const handleCreate = async ()=>{
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles`, {
        user_id: '29eb0c59-5baf-4417-a71b-1d7a301aec8e',
        name, personality, catchphrase, interests:interests.split(',').map(i=>i.trim()), avatar_url:avatar
      });
      alert('AI Role Created! ID: '+res.data.roleId);
      setName(''); setPersonality(''); setCatchphrase(''); setInterests(''); setAvatar('');
    }catch(err){ console.error(err); alert('Failed to create AI Role') }
  }

  return (
    <div style={{maxWidth:'600px',margin:'20px auto',fontFamily:'Roboto, sans-serif'}}>
      <h2 style={{color:'#007bff'}}>Create Your AI Character</h2>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} style={{width:'100%',padding:'10px',margin:'10px 0'}} />
      <input placeholder="Personality" value={personality} onChange={e=>setPersonality(e.target.value)} style={{width:'100%',padding:'10px',margin:'10px 0'}} />
      <input placeholder="Catchphrase" value={catchphrase} onChange={e=>setCatchphrase(e.target.value)} style={{width:'100%',padding:'10px',margin:'10px 0'}} />
      <input placeholder="Interests (comma separated)" value={interests} onChange={e=>setInterests(e.target.value)} style={{width:'100%',padding:'10px',margin:'10px 0'}} />
      <input placeholder="Avatar URL" value={avatar} onChange={e=>setAvatar(e.target.value)} style={{width:'100%',padding:'10px',margin:'10px 0'}} />
      <button onClick={handleCreate} style={{padding:'10px 20px',borderRadius:'8px',border:'none',background:'#007bff',color:'white',cursor:'pointer'}}>Create AI Role</button>
    </div>
  )
}