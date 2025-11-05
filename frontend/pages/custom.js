import { useState } from "react";

export default function CustomPage() {
  const [form, setForm] = useState({
    gender: "",
    personality: "",
    appearance: "",
    interests: "",
    language: "",
    chatStyle: "",
    contact: "",
    notes: "",
    email: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/custom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server.");
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        <h2>✅ 提交成功！Your request has been received!</h2>
        <p>我们会尽快安排真人陪聊师与你联系。</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "60px auto", padding: "40px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>定制真人陪聊师 / Customize Your Real Companion</h1>
      <form onSubmit={handleSubmit}>
        {["gender", "personality", "appearance", "interests", "language", "chatStyle", "notes", "contact", "email"].map((field) => (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: "bold", display: "block", marginBottom: "6px" }}>
              {field === "gender" ? "性别 Gender" :
               field === "personality" ? "性格 Personality" :
               field === "appearance" ? "外貌 Appearance" :
               field === "interests" ? "兴趣 Interests" :
               field === "language" ? "语言 Language" :
               field === "chatStyle" ? "聊天风格 Chat Style" :
               field === "notes" ? "备注 Notes" :
               field === "contact" ? "联系方式 Contact Info" :
               "邮箱 Email"}
            </label>
            <input
              name={field}
              value={form[field]}
              onChange={handleChange}
              required={field !== "notes"}
              placeholder={`请输入${field} / Enter ${field}`}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
        <p style={{ fontSize: "13px", color: "#777", marginBottom: "10px" }}>
          ⚠️ 定制服务仅用于聊天与合法行为 / For chat & legal purposes only.
        </p>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          提交 / Submit
        </button>
      </form>
    </div>
  );
}
