import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HomePage() {
  const [lang, setLang] = useState("zh");
  const [user, setUser] = useState(null);

  const t = {
    zh: {
      title: "Emovibe · 情感陪聊与心灵树洞平台",
      subtitle: "AI与真人双重陪伴，让孤独不再难言。",
      chatAI: "AI陪聊",
      treehole: "心灵树洞",
      membership: "会员专区",
      customCompanion: "定制真人陪聊师",
      description:
        "在Emovibe，你可以与AI倾诉，定制真实陪聊师，或匿名分享心情。安全、私密、治愈，是我们对你的承诺。",
      login: "登录",
      register: "注册",
      logout: "退出登录",
      switch: "ENGLISH",
    },
    en: {
      title: "Emovibe · Emotional Chat & Healing Space",
      subtitle: "AI & Real Companions — never feel alone again.",
      chatAI: "AI Chat",
      treehole: "Treehole",
      membership: "Membership",
      customCompanion: "Customize Real Companion",
      description:
        "At Emovibe, you can chat with AI, request a real companion, or share feelings anonymously. Safe, private, and comforting — that’s our promise.",
      login: "Login",
      register: "Register",
      logout: "Logout",
      switch: "中文",
    },
  };

  const text = t[lang];

  useEffect(() => {
    // 检查 Supabase 用户状态
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    // 监听登录状态变化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        fontFamily: "'Poppins', 'Noto Sans SC', sans-serif",
      }}
    >
      {/* 语言切换按钮 */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <button
          onClick={() => setLang(lang === "zh" ? "en" : "zh")}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "8px 14px",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {text.switch}
        </button>
      </div>

      {/* 登录状态栏 */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        {user ? (
          <button
            onClick={handleLogout}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              padding: "8px 14px",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {text.logout}
          </button>
        ) : (
          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/login">
              <button className="menu-btn small">{text.login}</button>
            </Link>
            <Link href="/register">
              <button className="menu-btn small">{text.register}</button>
            </Link>
          </div>
        )}
      </div>

      {/* 主标题区 */}
      <h1
        style={{
          fontSize: "2.6rem",
          textAlign: "center",
          marginBottom: "15px",
          fontWeight: "700",
        }}
      >
        {text.title}
      </h1>
      <h2
        style={{
          fontSize: "1.3rem",
          textAlign: "center",
          marginBottom: "30px",
          opacity: "0.9",
        }}
      >
        {text.subtitle}
      </h2>

      {/* 功能按钮 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        <Link href="/chat">
          <button className="menu-btn">{text.chatAI}</button>
        </Link>
        <Link href="/treehole">
          <button className="menu-btn">{text.treehole}</button>
        </Link>
        <Link href="/membership">
          <button className="menu-btn">{text.membership}</button>
        </Link>
        <Link href="/custom">
          <button className="menu-btn highlight">{text.customCompanion}</button>
        </Link>
      </div>

      {/* 描述 */}
      <p
        style={{
          marginTop: "40px",
          maxWidth: "600px",
          textAlign: "center",
          fontSize: "1rem",
          lineHeight: "1.6",
          opacity: "0.95",
        }}
      >
        {text.description}
      </p>

      <style jsx>{`
        .menu-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          padding: 14px 28px;
          color: white;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .menu-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }
        .menu-btn.small {
          padding: 8px 16px;
          font-size: 14px;
        }
        .highlight {
          background: #ff69b4;
          color: white;
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.6);
        }
        .highlight:hover {
          background: #ff85c1;
        }
      `}</style>
    </div>
  );
}