import { useState } from "react";

export default function ChatPage() {
  const [roleId, setRoleId] = useState("");
  const [userId, setUserId] = useState("demo_user");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!roleId || !message.trim()) return;
    setLoading(true);

    const userMsg = { sender: "user", message };
    setChat([...chat, userMsg]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, roleId, user_id: userId }),
      });
      const data = await res.json();
      const botMsg = { sender: "bot", message: data.reply };
      setChat((prev) => [...prev, botMsg]);
    } catch (err) {
      setChat((prev) => [...prev, { sender: "bot", message: "❌ AI failed to respond." }]);
    } finally {
      setMessage("");
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", fontFamily: "Arial" }}>
      <h1>Chat with Your AI</h1>
      <input
        placeholder="Enter your AI Role ID"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <div style={{ border: "1px solid #ddd", padding: 10, height: 400, overflowY: "scroll" }}>
        {chat.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.message}
          </p>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, marginRight: 10 }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}