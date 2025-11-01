import { useState } from "react"
import { supabase } from "../utils/supabaseClient"
import { useRouter } from "next/router"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert("注册失败：" + error.message)
    else {
      alert("注册成功！请登录")
      router.push("/login")
    }
  }

  return (
    <div className="register-container">
      <h1>注册 Emovibe</h1>
      <input type="email" placeholder="邮箱" value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" placeholder="密码" value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={handleRegister}>注册</button>
    </div>
  )
}
