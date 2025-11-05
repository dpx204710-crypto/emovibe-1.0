import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage("❌ 登录失败：" + error.message);
    } else {
      setMessage("✅ 登录成功，正在跳转...");
      setTimeout(() => router.push("/"), 1000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>登录 / Login</h1>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="邮箱 / Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="密码 / Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            登录 / Login
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={{ marginTop: "20px" }}>
          还没有账号？ <a href="/register" style={styles.link}>注册</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #74ABE2, #5563DE)",
    color: "white",
    fontFamily: "'Poppins', 'Noto Sans SC', sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.1)",
    padding: "40px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    fontSize: "16px",
  },
  button: {
    background: "#ff69b4",
    border: "none",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
  },
  message: {
    marginTop: "10px",
    fontSize: "14px",
  },
  link: {
    color: "#fff",
    textDecoration: "underline",
  },
};