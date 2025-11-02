import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../pages/_app';

export default function Header({ locale, setLocale }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user || null);
    })();
    return () => mounted = false;
  }, []);

  return (
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 36px',background:'#007bff',color:'#fff'}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <Link href="/"><a style={{color:'white',fontWeight:700,fontSize:22}}>EmoVibe</a></Link>
        <nav style={{display:'flex',gap:16}}>
          <Link href="/"><a style={{color:'white'}}>{locale==='en'?'Home':'首页'}</a></Link>
          <Link href="/companions"><a style={{color:'white'}}>{locale==='en'?'Real Companions':'真人陪聊师'}</a></Link>
          <Link href="/ai-create"><a style={{color:'white'}}>{locale==='en'?'AI Create':'AI创建'}</a></Link>
          <Link href="/treehole"><a style={{color:'white'}}>{locale==='en'?'Treehole':'树洞'}</a></Link>
          <Link href="/membership"><a style={{color:'white'}}>{locale==='en'?'Membership':'会员'}</a></Link>
        </nav>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button onClick={()=>setLocale(locale==='en'?'zh':'en')} style={{border:'1px solid rgba(255,255,255,0.5)',borderRadius:6,padding:'6px 10px',background:'transparent',color:'#fff'}}>
          {locale==='en'?'中文':'EN'}
        </button>
        {!user?(
          <>
            <Link href="/login"><a style={{color:'#fff',padding:'6px 12px',border:'1px solid #fff',borderRadius:6}}>Login</a></Link>
            <Link href="/register"><a style={{color:'#007bff',background:'#fff',padding:'6px 12px',borderRadius:6}}>Register</a></Link>
          </>
        ):(
          <span style={{color:'#fff'}}>{user.email}</span>
        )}
      </div>
    </header>
  );
}