// components/HeroSection.js
import Link from 'next/link';

export default function HeroSection({ t }) {
  return (
    <section className="hero" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'80vh',textAlign:'center',background:'linear-gradient(135deg,#e0f0ff,#cce5ff)'}}>
      <h1 style={{fontSize:48,color:'#007bff',marginBottom:20}}>{t('Professional Emotional Companion','专业情感陪聊平台')}</h1>
      <p style={{fontSize:20,maxWidth:600,marginBottom:30}}>
        {t('Chat with real people or AI. Share your mood. Enjoy private support.','与真人或AI聊天，分享心情，享受专属陪聊。')}
      </p>
      <div style={{display:'flex',gap:12}}>
        <Link href="/membership"><a style={{padding:'14px 28px',background:'#007bff',color:'#fff',borderRadius:6}}>{t('Join $99/Week','开通会员 $99/周')}</a></Link>
        <Link href="/ai-create"><a style={{padding:'14px 28px',background:'#00c8ff',color:'#fff',borderRadius:6}}>{t('Create AI','创建 AI')}</a></Link>
      </div>
    </section>
  );
}
