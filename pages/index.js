import Navbar from "../components/Navbar"
import Link from "next/link"

export default function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <header className="hero">
        <img src="/hero.png" alt="Emovibe Logo" className="hero-image" />
        <h1 className="hero-title">Emovibe — 陪伴你的每一个瞬间</h1>
        <p className="hero-subtitle">
          选择真人陪聊师，或与AI角色倾诉心声，发现温暖的陪伴。
        </p>
        <div className="hero-buttons">
          <Link href="/login" className="btn">登录 / 注册</Link>
          <Link href="/ai" className="btn-secondary">AI 角色中心</Link>
        </div>
      </header>
    </div>
  )
}
