import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function PayPage() {
  return (
    <ProtectedRoute>
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <h1 style={styles.title}>💎 开通 Emovibe 会员</h1>
          <p style={styles.desc}>99 美金 / 周，解锁全部陪聊与定制功能</p>

          <div style={styles.payBox}>
            <div style={styles.method}>
              <img src="/wechat.png" alt="WeChat Pay" style={styles.icon} />
              <p>微信支付（中国区）</p>
              <button style={styles.button}>立即支付</button>
            </div>

            <div style={styles.method}>
              <img src="/paypal.png" alt="PayPal" style={styles.icon} />
              <p>PayPal（国际）</p>
              <button style={styles.button}>立即支付</button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #141E30, #243B55)",
    color: "white",
    fontFamily: "'Poppins', 'Noto Sans SC', sans-serif",
  },
  main: {
    textAlign: "center",
    paddingTop: "100px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
  },
  desc: {
    marginTop: "10px",
    fontSize: "16px",
  },
  payBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    gap: "30px",
    flexWrap: "wrap",
  },
  method: {
    background: "rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    width: "260px",
  },
  icon: {
    width: "80px",
    height: "80px",
  },
  button: {
    marginTop: "15px",
    background: "#00c8ff",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
