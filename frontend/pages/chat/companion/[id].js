// frontend/pages/chat/companion/[id].js
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../_app';
import axios from 'axios';
import Header from '../../../components/Header';

export default function CompanionChat(){
  const router = useRouter();
  const { id } = router.query;
  const [locale,setLocale]=useState('en');
  const [companion,setCompanion]=useState(null);
  const [user,setUser]=useState(null);
  const [text,setText]=useState('');
  const [messages,setMessages]=useState([]);
  const endRef = useRef(null);
  const API = process.env.NEXT_PUBLIC_API_URL || '/api';
  const t=(en,zh)=>locale==='en'?en:zh;

  useEffect(()=>{ (async()=>{ const { data } = await supabase.auth.getUser(); setUser(data?.user || null); })(); },[]);
  useEffect(()=>{ if(id) fetchCompanion(); },[id]);

  async function fetchCompanion(){
    const res = await axios.get(`${API}/companions`);
    const comp = res.data.companions.find(c=>c.id===id);
    setCompanion(comp || null);
    // load prior chats from chats table
    const { data } = await supabase.from('chats').select('*').or(`companion_id.eq.${id},ai_role_id.is.null`).order('created_at',{ascending:true});
    setMessages(data || []);
  }

  async function checkMember(){
    if(!user) return false;
    const res = await axios.get(`${API}/subscription-status?userId=${user.id}`);
    return res.data?.active;
  }

  async function send(){
    if(!user){ alert(t('Please login first','请先登录')); return; }
    const isMember = await checkMember();
    if(!isMember){ alert(t('Members only. Please subscribe.','仅限会员，请开通会员')); return; }

    if(!text.trim()) return;
    const payload = { user_id: user.id, companion_id: id, message: text, reply: null };
    // store message - companion reply will be added when companion replies (or via their dashboard)
    await supabase.from('chats').insert([payload]);
    setMessages(prev => [...prev, { ...payload, created_at: new Date().toISOString() }]);
    setText('');
    endRef.current?.scrollIntoView({behavior:'smooth'});
  }

  return (
    <>
      <Header locale={locale} setLocale={setLocale}/>
      <div style={{maxWidth:880,margin:'24px auto'}}>
        <h2>{t('Chat with','与')} {companion?.name || '...'}</h2>
        <div style={{display:'flex',gap:16}}>
          <div style={{flex:2}}>
            <div style={{height:420,overflowY:'auto',background:'#f8fafc',padding:12,borderRadius:8}}>
              {messages.map((m,idx)=>(
                <div key={idx} style={{marginBottom:10}}>
                  <div style={{fontSize:13,color:'#64748b'}}>{m.created_at ? new Date(m.created_at).toLocaleString() : ''}</div>
                  <div style={{marginTop:6}}><b>{m.user_id === (user?.id) ? t('You','你') : (companion?.name || t('Companion','陪聊师'))}:</b> {m.message || m.reply}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div style={{display:'flex',gap:8,marginTop:12}}>
              <input value={text} onChange={e=>setText(e.target.value)} className="form-input" placeholder={t('Type your message...','输入消息...')} />
              <button className="btn btn-primary" onClick={send}>{t('Send','发送')}</button>
            </div>
          </div>

          <aside style={{width:260}}>
            <div className="card">
              <img src={companion?.avatar_url || '/ai-placeholder.png'} style={{width:'100%',borderRadius:6}} />
              <h3>{companion?.name}</h3>
              <div className="small-muted">{t('Specialization','擅长')}: {companion?.specialization}</div>
              <div style={{marginTop:8}}>{companion?.price ? `$${companion.price}` : t('Contact for price','面议')}</div>
              <div style={{marginTop:10}}><a className="small-muted" href={`mailto:${companion?.contact}`}>{t('Contact','联系')}</a></div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
