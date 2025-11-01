import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link href="/">Emovibe</Link>
      </div>
      <div className="nav-links">
        <Link href="/">首页</Link>
        <Link href="/chat">聊天室</Link>
        <Link href="/ai">AI角色</Link>
        <Link href="/recharge">充值中心</Link>
      </div>
    </nav>
  )
}
