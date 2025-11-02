<button class="btn btn-secondary" onclick="window.location.href='/custom-chat'">定制真人陪聊师</button>
import Head from 'next/head';
import { useState } from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const [locale, setLocale] = useState('en');
  const t = (en, zh) => locale==='en'?en:zh;

  return (
    <>
      <Head>
        <title>EmoVibe — {t('Professional Emotional Companion','专业情感陪聊')}</title>
        <meta name="description" content={t('AI companions, anonymous treehole, counseling support','AI陪聊、匿名树洞、心理疏导')}/>
      </Head>
      <Header locale={locale} setLocale={setLocale}/>
      <HeroSection t={t}/>

      <section style={{display:'flex',justifyContent:'center',gap:36,padding:'60px 20px',flexWrap:'wrap'}}>
        <FeatureCard title={t('AI Companion','AI角色陪聊')} desc={t('Create your personalized AI companion.','创建属于你的 AI 角色')}/>
        <FeatureCard title={t('Anonymous Treehole','匿名树洞')} desc={t('Share your feelings anonymously.','匿名发布心情')}/>
        <FeatureCard title={t('Real Chat','真人陪聊师')} desc={t('Connect with professional companions.','与专业陪聊师互动')}/>
        <FeatureCard title={t('Counseling','心理疏导')} desc={t('Private support from professionals.','专业心理支持')}/>
      </section>

      <footer style={{textAlign:'center',padding:24,background:'#e0f0ff',marginTop:40}}>
        &copy; 2025 EmoVibe. {t('All Rights Reserved','版权所有')}
      </footer>
    </>
  );
}