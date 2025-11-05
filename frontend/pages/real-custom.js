import { useState } from "react";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RealCustomPage() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    personality: "",
    request: "",
    contact: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("real_customs").insert([
        {
          name: form.name,
          gender: form.gender,
          personality: form.personality,
          request: form.request,
          contact: form.contact,
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      alert("提交失败：" + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <ProtectedRoute>
        <div style={styles.container}>
          <Navbar />
          <div style={styles.success}>
            <h2>✅ 定制请求已提交成功！</h2>
            <p>我们的陪聊师会尽快与您联系，请保持联系方式畅通。</p>
          </div>
        </div>
      </ProtectedRoute>
    );

  return (
    <ProtectedRoute>
      <div style={styles.container}>
        <Navbar />
        <main style={styles.main}>
          <h1 style={styles.title}>🧍 定制您的专属真人陪聊</h1>
          <p style={styles.desc}>
            请填写以下信息，平台将根据您的需求匹配最合适的陪聊师。<br />
            所有行为仅限聊天与心理疏导，禁止任何违法行为。
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label>您的称呼：</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="请输入昵称"
              required
            />

            <label>期望陪聊师性别：</label>
            <input
              name="gender"
              type="text"
              value={form.gender}
              onChange={handleChange}
              placeholder="完全自定义（如：温柔女性、幽默男性…）"
              required
            />

            <label>性格偏好：</label>
            <textarea
              name="personality"
              value={form.personality}
              onChange={handleChange}
              placeholder="描述性格特点、说话方式、语气等"
              rows={3}
              required
            />

            <label>您的定制要求：</label>
            <textarea
              name="request"
              value={form.request}
              onChange={handleChange}
              placeholder="您希望TA如何陪聊？话题方向？聊天时长？"
              rows={4}
              required
            />

            <label>联系方式（微信 / 邮箱 / Telegram）：</label>
            <input
              name="contact"
              type="text"
              value={form.contact}
              onChange={handleChange}
              placeholder="方便接单后联系您"
              required
            />

            <p style={styles.notice}>
              ⚠️ 本服务仅提供线上聊天与心理疏导，禁止任何违法内容。
            </p>

            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "提交中..." : "提交定制请求"}
            </button>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #3b5998, #192f6a)",
    color: "white",
    fontFamily: "'Poppins', 'Noto Sans SC', sans-serif",
    paddingBottom: "100px",
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
    fontSize: "16px",
    margin: "10px auto 40px",
    maxWidth: "600px",
    lineHeight: "1.6",
  },
  form: {
    maxWidth: "500px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    background: "rgba(255,255,255,0.1)",
    padding: "30px",
    borderRadius: "12px",
  },
  button: {
    background: "#00c8ff",
    border: "none",
    color: "white",
    padding: "14px 20px",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
  },
  notice: {
    fontSize: "12px",
    color: "#ffb3b3",
    marginTop: "5px",
  },
  success: {
    textAlign: "center",
    paddingTop: "150px",
  },
};
