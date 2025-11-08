import Navbar from '../components/Navbar';

export default function Home({ lang = 'en' }) {
  const t = (en, zh) => (lang === 'zh' ? zh : en);
  return (
    <div>
      <Navbar lang={lang} />
      <main style={{ textAlign: 'center', padding: '80px' }}>
        <h1>{t('Welcome to Emovibe', '欢迎来到 Emovibe')}</h1>
        <p>{t('Your emotional chat companion.', '您的情感陪聊伙伴。')}</p>
        <button style={{ padding: '10px 20px', marginTop: '30px' }}>
          {t('Join Membership - $99/week', '加入会员 - 每周99美元')}
        </button>
      </main>
    </div>
  );
}