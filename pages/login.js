import { useState } from "react"
import { supabase } from "../utils/supabaseClient"
import { useRouter } from "next/router"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) alert("登录失败：" + error.message)
    else router.push("/")
  }

  return (
    <div className="login-container">
      <h1>登录 Emovibe</h1>
      <input type="email" placeholder="邮箱" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="密码" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={handleLogin}>登录</button>
      <p>还没有账号？ <a href="/register">立即注册</a></p>
    </div>
  )
}
