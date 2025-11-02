// frontend/pages/companions.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { supabase } from './_app';
import Header from '../components/Header';

export default function Companions(){
  const [locale,setLocale]=useState('en');
  const [list,setList]=useState([]);
  const API = process.env.NEXT_PUBLIC_API_URL || '/api';
  const t=(en,zh)=>locale==='en'?en:zh;

  useEffect(()=>{ fetch(); },[]);
  async function fetch(){ const res = await axios.get(`${API}/companions`); setList(res.data.companions || []); }

  return (
    <>
      <Header locale={locale} setLocale={setLocale} />
      <div style={{maxWidth:1000,margin:'32px auto'}}>
        <h2>{t('Real Companions','真人陪聊师')}</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:12,marginTop:16}}>
          {list.map(c=>(
            <div key={c.id} style={{padding:16,background:'#fff',borderRadius:10,boxShadow:'0 6px 20px rgba(0,0,0,0.04)'}}>
              <img src={c.avatar_url || '/ai-placeholder.png'} style={{width:72,height:72,borderRadius:10}} />
              <h3 style={{marginTop:8}}>{c.name}</h3>
              <div className="small-muted">{t('Specialization','擅长')}: {c.specialization}</div>
              <div className="small-muted">{t('Languages','语言')}: {(c.languages||[]).join(', ')}</div>
              <div style={{marginTop:8,fontWeight:700}}>{c.price ? `$${c.price}` : t('Contact for price','面议')}</div>
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <Link href={`/chat/companion/${c.id}`}><a className="btn btn-primary">{t('Chat / Chat','聊天')}</a></Link>
                <Link href="/custom-chat"><a className="btn btn-outline">{t('Custom Request','定制')}</a></Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
