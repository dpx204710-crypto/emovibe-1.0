import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ChatRoom() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    // 获取当前登录用户
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // 读取URL参数里的room_id
    const params = new URLSearchParams(window.location.search);
    const id = params.get("room");
    setRoomId(id);

    if (id) loadMessages(id);
  }, []);

  // 监听实时聊天
  useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel("chatroom")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [roomId]);

  // 加载聊天记录
  async function loadMessages(id) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", id)
      .order("created_at", { ascending: true });

    if (error) console.error(error);
    else setMessages(data);
  }

  // 发送消息
  async function sendMessage() {
    if (!newMessage.trim() || !user || !roomId) return;

    const { error } = await supabase.from("messages").insert([
      {
        room_id: roomId,
        sender_id: user.id,
        content: newMessage,
      },
    ]);

    if (error) console.error(error);
    else setNewMessage("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 flex flex-col">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">💬 一对一聊天</h2>

        <div className="flex-1 overflow-y-auto border border-gray-100 rounded-md p-3 mb-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`my-2 flex ${
                msg.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[75%] ${
                  msg.sender_id === user?.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
}
