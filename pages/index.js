import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>EmoVibe | 温暖陪伴 · 治愈心灵</title>
      </Head>
      <header className="navbar">
        <div className="logo">EmoVibe</div>
        <nav>
          <Link href="/">首页</Link>
          <Link href="/chat">聊天室</Link>
          <Link href="/ai">AI角色</Link>
          <Link href="/recharge">充值中心</Link>
          <Link href="/login">登录</Link>
          <Link href="/register">注册</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>温暖的陪伴，从 EmoVibe 开始</h1>
          <p>AI 与真人陪伴结合的平台，让每一个孤独的夜晚都有回应。</p>
          <Link href="/register" className="cta">立即加入</Link>
        </div>
        <Image
          src="/logo.png"
          width={400}
          height={400}
          alt="EmoVibe Illustration"
          className="hero-img"
        />
      </section>

      <section className="features">
        <div className="feature">
          <h3>AI 定制角色</h3>
          <p>创建属于你的专属AI人格，让它懂你、记你、回应你。</p>
          <Link href="/ai" className="feature-btn">进入AI角色</Link>
        </div>
        <div className="feature">
          <h3>真人聊天室</h3>
          <p>真实、匿名、温暖的对话空间。</p>
          <Link href="/chat" className="feature-btn">进入聊天室</Link>
        </div>
        <div className="feature">
          <h3>充值与成长</h3>
          <p>支持 AI 陪聊、解锁高级语音、VIP陪伴等。</p>
          <Link href="/recharge" className="feature-btn">进入充值中心</Link>
        </div>
      </section>

      <footer className="footer">
        © 2025 EmoVibe | 温暖陪伴 · 治愈心灵
      </footer>

      <style jsx>{`
        :root {
          --primary: #ffcc66;
          --secondary: #fff7e6;
          --shadow: rgba(0, 0, 0, 0.1);
        }
        body {
          margin: 0;
          font-family: "Poppins", "Noto Sans SC", sans-serif;
          background: var(--secondary);
          color: #333;
        }
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 60px;
          background: #fff;
          box-shadow: 0 2px 8px var(--shadow);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .logo {
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--primary);
        }
        nav a {
          margin-left: 25px;
          text-decoration: none;
          color: #555;
          font-weight: 500;
        }
        nav a:hover {
          color: var(--primary);
        }
        .hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          padding: 100px 60px;
        }
        .hero-text {
          max-width: 500px;
        }
        .hero-text h1 {
          font-size: 2.5rem;
        }
        .hero-text p {
          margin-top: 15px;
          font-size: 1.1rem;
          color: #555;
        }
        .cta {
          display: inline-block;
          margin-top: 25px;
          background: var(--primary);
          color: white;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
        }
        .hero-img {
          border-radius: 20px;
          box-shadow: 0 8px 20px var(--shadow);
        }
        .features {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          background: #fff;
          padding: 80px 40px;
        }
        .feature {
          width: 300px;
          background: var(--secondary);
          border-radius: 16px;
          box-shadow: 0 5px 12px var(--shadow);
          padding: 30px;
          text-align: center;
          margin: 20px;
        }
        .feature h3 {
          color: var(--primary);
        }
        .feature-btn {
          display: inline-block;
          margin-top: 15px;
          background: var(--primary);
          color: white;
          padding: 10px 20px;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 500;
        }
        .footer {
          background: #333;
          color: #ddd;
          text-align: center;
          padding: 40px 10px;
          font-size: 0.9rem;
        }
      `}</style>
    </>
  );
}