import { useState } from "react"
import Navbar from "../components/Navbar"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const sendMessage = async () => {
    if (!input.trim()) return

    const newMsg = { sender: "你", text: input }
    setMessages([...messages, newMsg])
    setInput("")

    const res = await fetch("/api/aiChat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    })
    const data = await res.json()

    setMessages((prev) => [...prev, { sender: "AI小暖", text: data.reply }])
  }

  return (
    <div className="chat-container">
      <Navbar />
      <h1>AI 聊天室</h1>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender === "你" ? "user" : "ai"}`}>
            <strong>{msg.sender}：</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="输入..." />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  )
}