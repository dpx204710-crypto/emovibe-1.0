import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ lang }) {
  const t = (en, zh) => (lang === 'zh' ? zh : en);
  return (
    <nav style={{display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1a1a1a', color: 'white'}}>
      <div><strong>Emovibe</strong></div>
      <div style={{display: 'flex', gap: '20px'}}>
        <Link href="/">{t('Home', '首页')}</Link>
        <Link href="/ai">{t('AI Chat', 'AI陪聊')}</Link>
        <Link href="/custom">{t('Custom Human Chat', '真人定制')}</Link>
        <Link href="/login">{t('Login', '登录')}</Link>
      </div>
      <LanguageSwitcher />
    </nav>
  );
}