import { useState } from "react";

export default function AiCompanion() {
  const [character, setCharacter] = useState({
    name: "",
    personality: "",
    style: "",
  });
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const newChat = [...chat, { role: "user", content: message }];
    setChat(newChat);
    setMessage("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        character,
      }),
    });
    const data = await res.json();
    setChat([...newChat, { role: "assistant", content: data.reply }]);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎭 自定义AI陪聊角色</h1>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="角色名称（如：小暖、治愈精灵）"
          value={character.name}
          onChange={(e) => setCharacter({ ...character, name: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="性格特点（如：温柔、积极、安静）"
          value={character.personality}
          onChange={(e) =>
            setCharacter({ ...character, personality: e.target.value })
          }
        />
        <input
          style={styles.input}
          placeholder="聊天风格（如：像朋友一样、像恋人一样）"
          value={character.style}
          onChange={(e) => setCharacter({ ...character, style: e.target.value })}
        />
      </div>

      <div style={styles.chatBox}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: c.role === "user" ? "flex-end" : "flex-start",
              background: c.role === "user" ? "#fff4c2" : "#f2f2f2",
            }}
          >
            <b>{c.role === "user" ? "我：" : character.name || "AI"} </b>
            {c.content}
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.textInput}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="输入消息..."
        />
        <button onClick={sendMessage} disabled={loading} style={styles.button}>
          {loading ? "发送中..." : "发送"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Noto Sans SC', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#fff8e1",
    minHeight: "100vh",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    color: "#b88b00",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
    width: "90%",
    maxWidth: "400px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "90%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "8px",
    padding: "10px",
    minHeight: "300px",
    overflowY: "auto",
    marginBottom: "15px",
  },
  inputArea: {
    display: "flex",
    gap: "10px",
    width: "90%",
    maxWidth: "400px",
  },
  textInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#ffcc00",
    color: "#333",
    fontWeight: "bold",
    cursor: "pointer",
  },
  message: {
    padding: "8px 10px",
    borderRadius: "6px",
    maxWidth: "80%",
  },
};