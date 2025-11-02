import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { supabase } from './_app';
import { useRouter } from 'next/router';

export default function Chat(){
  const router = useRouter();
  const { roleId, userId } = router.query;
  const [role,setRole]=useState(null);
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');
  const [sending,setSending]=useState(false);
  const endRef = useRef(null);

  useEffect(()=>{ if(roleId) fetchRole(); },[roleId]);
  useEffect(()=>{ if(roleId && userId) fetchHistory(); },[roleId, userId]);
  useEffect(()=> endRef.current?.scrollIntoView({behavior:'smooth'}), [messages]);

  async function fetchRole(){
    try{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles/${roleId}`);
      setRole(res.data.role);
    }catch(err){ console.error(err); }
  }
  async function fetchHistory(){
    try{
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-history?roleId=${roleId}&userId=${userId}`);
      setMessages(res.data.messages || []);
    }catch(err){ console.error(err); }
  }

  const send = async () => {
    if(!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender:'user', message:text }]);
    setSending(true);
    try{
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, { message:text, roleId, user_id: userId });
      const reply = res.data.reply || '';
      // typing effect simulation
      let shown = '';
      setMessages(prev => [...prev, { sender:'bot', message:'' }]);
      for (let i=0;i<reply.length;i++){
        shown += reply[i];
        setMessages(prev=>{
          const copy = [...prev];
          copy[copy.length-1] = { sender:'bot', message: shown };
          return copy;
        });
        await new Promise(r=>setTimeout(r, 10));
      }
    }catch(err){
      console.error(err);
      setMessages(prev => [...prev, { sender:'bot', message:'AI failed to respond.' }]);
    }finally{ setSending(false); }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth:900,margin:'20px auto'}}>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <img src={role?.avatar_url || '/ai-placeholder.png'} style={{width:60,height:60,borderRadius:10}} />
          <div>
            <h3 style={{margin:0}}>{role?.name || 'Loading...'}</h3>
            <div className="small-muted">{role?.personality}</div>
          </div>
          <div style={{marginLeft:'auto'}}>
            <a href="/counseling" className="small-muted">Counseling / 心理疏导</a>
          </div>
        </div>

        <div style={{height:420,overflowY:'auto',marginTop:16,background:'#f8fafc',padding:12,borderRadius:8}}>
          {messages.map((m,i)=>(
            <div key={i} style={{display:'flex',justifyContent: m.sender==='user' ? 'flex-end' : 'flex-start', marginBottom:8}}>
              <div style={{
                background: m.sender==='user' ? 'var(--blue)' : '#fff',
                color: m.sender==='user' ? '#fff' : 'var(--blue)',
                padding:'10px 14px',
                borderRadius:16,
                maxWidth:'70%',
                boxShadow: m.sender==='user' ? 'none' : '0 2px 8px rgba(2,6,23,0.06)'
              }}>{m.message}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div style={{display:'flex',gap:8,marginTop:12}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} placeholder="Write a message / 输入消息..." className="form-input" />
          <button className="btn btn-primary" onClick={send} disabled={sending}>{sending ? '...' : 'Send / 发送'}</button>
        </div>
      </div>
    </div>
  );
}