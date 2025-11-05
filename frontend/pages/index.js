import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <h1 style={styles.title}>💬 Emovibe 专业陪聊 & 情绪疗愈平台</h1>
        <p style={styles.subtitle}>
          AI自定义陪聊角色 + 真人定制陪聊 + 每周会员制体验
        </p>

        <div style={styles.buttons}>
          <Link href="/ai-custom">
            <button style={styles.btn}>🤖 自定义AI陪聊师</button>
          </Link>
          <Link href="/real-custom">
            <button style={styles.btn}>🧍 真人定制陪聊</button>
          </Link>
          <Link href="/pay">
            <button style={styles.vip}>💎 开通会员</button>
          </Link>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(120deg, #667eea, #764ba2)",
    color: "white",
    fontFamily: "'Poppins', 'Noto Sans SC', sans-serif",
  },
  main: {
    paddingTop: "120px",
    textAlign: "center",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "18px",
    marginTop: "10px",
  },
  buttons: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  btn: {
    background: "#00c8ff",
    border: "none",
    color: "white",
    padding: "14px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
  vip: {
    background: "#ff69b4",
    border: "none",
    color: "white",
    padding: "14px 28px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
  },
};