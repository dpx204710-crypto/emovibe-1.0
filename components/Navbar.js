import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>💗 Emovibe</h2>
      <div style={styles.links}>
        <Link href="/">首页</Link>
        {user ? (
          <>
            <Link href="/profile">会员中心</Link>
            <Link href="/pay">续费</Link>
            <button onClick={handleLogout} style={styles.logout}>
              登出
            </button>
          </>
        ) : (
          <>
            <Link href="/login">登录</Link>
            <Link href="/register">注册</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    position: "sticky",
    top: 0,
    zIndex: 999,
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#fff",
  },
  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  logout: {
    background: "#ff4d6d",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};