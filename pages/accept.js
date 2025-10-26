import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AcceptPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  // 获取当前登录陪聊师
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    loadOrders();
  }, []);

  // 加载所有待接单的订单
  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setOrders(data || []);
  }

  // 接单逻辑
  async function handleAccept(orderId) {
    if (!user) {
      setMessage("⚠️ 请先登录陪聊师账号。");
      return;
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status: "accepted",
        accepted_by: user.id,
      })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      setMessage("❌ 接单失败，请重试。");
    } else {
      setMessage("✅ 接单成功！请等待客户确认。");
      loadOrders();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center py-10 px-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6">📋 陪聊师接单中心</h1>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-gray-700 rounded-md px-4 py-2 mb-4">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">暂无待接单的客户订单。</p>
      ) : (
        <div className="w-full max-w-2xl space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-sm rounded-md border border-gray-100 p-4 hover:shadow-md transition"
            >
              <p><strong>性别偏好：</strong>{order.gender || "不限"}</p>
              <p><strong>性格：</strong>{order.style}</p>
              <p><strong>服务类型：</strong>{order.service}</p>
              <p><strong>联系方式：</strong>{order.contact || "未填写"}</p>
              <p className="text-sm text-gray-400 mt-1">
                下单时间：{new Date(order.created_at).toLocaleString()}
              </p>
              <button
                onClick={() => handleAccept(order.id)}
                className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              >
                📨 接单
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
