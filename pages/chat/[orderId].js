import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

export default function ChatPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!orderId) return;
    const loadMessages = async () => {
      const { data } = await supabase.from("messages").select("*").eq("order_id", orderId).order("created_at");
      setMessages(data || []);
    };
    loadMessages();

    const channel = supabase
      .channel("chat-" + orderId)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        setMessages(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [orderId]);

  const sendMessage = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("请先登录");
    if (!input.trim()) return;

    await supabase.from("messages").insert([{ order_id: orderId, sender_id: user.id, content: input }]);
    setInput("");
  };

  return (
    <div className="container">
      <h2>聊天中...</h2>
      <div style={{ height: 400, overflowY: "auto", border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
        {messages.map((m, i) => (
          <p key={i}><b>{m.sender_id.slice(0, 4)}:</b> {m.content}</p>
        ))}
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="输入消息..." />
      <button onClick={sendMessage}>发送</button>
    </div>
  );
}
