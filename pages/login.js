import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");

  const handleAuth = async () => {
    setLoading(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
      else window.location.href = "/";
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("注册成功，请登录");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>{mode === "login" ? "登录 Emovibe" : "注册 Emovibe"}</h2>
      <input placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} />
      <button disabled={loading} onClick={handleAuth}>
        {loading ? "处理中..." : mode === "login" ? "登录" : "注册"}
      </button>
      <p style={{ marginTop: 10, textAlign: "center" }}>
        {mode === "login" ? (
          <a href="#" onClick={() => setMode("signup")}>还没有账号？注册</a>
        ) : (
          <a href="#" onClick={() => setMode("login")}>已有账号？登录</a>
        )}
      </p>
    </div>
  );
}