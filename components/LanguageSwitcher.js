import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { query } = router;
  const lang = query.lang === 'zh' ? 'en' : 'zh';
  return (
    <button onClick={() => router.push({ pathname: router.pathname, query: { ...query, lang } })}>
      {query.lang === 'zh' ? 'English' : '中文'}
    </button>
  );
}
