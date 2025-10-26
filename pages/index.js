import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github', // 你也可以改为 "google"
    });
    if (error) alert(error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>💬 Emovibe 陪聊平台</h1>
        {user ? (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            退出登录
          </button>
        ) : (
          <button onClick={handleLogin} style={styles.loginBtn}>
            登录 / 注册
          </button>
        )}
      </header>

      <main style={styles.main}>
        <h2 style={styles.title}>找到你的专属陪聊师 💙</h2>
        <p style={styles.subtitle}>
          提供安静倾听、情感开导、温柔陪伴等服务。  
          由真实陪聊师在线陪你聊天。
        </p>
        <button
          style={styles.orderBtn}
          onClick={() => router.push('/order')}
        >
          立即下单匹配陪聊师
        </button>
      </main>

      <footer style={styles.footer}>
        <p>© 2025 Emovibe · 快乐沟通，从这里开始</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: '"Poppins", sans-serif',
    background: 'linear-gradient(to bottom right, #e0f2fe, #ffffff)',
    minHeight: '100vh',
    color: '#1e3a8a',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    padding: '20px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #cbd5e1',
  },
  logo: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2563eb',
  },
  loginBtn: {
    background: '#3b82f6',
    color: 'white',
    padding: '8px 18px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  logoutBtn: {
    background: '#ef4444',
    color: 'white',
    padding: '8px 18px',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  main: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    maxWidth: 600,
    margin: '0 auto 40px',
    lineHeight: 1.6,
  },
  orderBtn: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '14px 30px',
    borderRadius: 10,
    fontSize: 18,
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    padding: 20,
    borderTop: '1px solid #cbd5e1',
    fontSize: 14,
  },
};