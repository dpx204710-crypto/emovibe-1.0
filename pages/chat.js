import { useState } from "react"
import Navbar from "../components/Navbar"

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { sender: "你", text: input }])
    setInput("")
    // TODO: 后面接入AI或真人
  }

  return (
    <div className="chat-container">
      <Navbar />
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === "你" ? "user" : "bot"}`}>
            <strong>{msg.sender}：</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="输入你的消息..." />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  )
}
