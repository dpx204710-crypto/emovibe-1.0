import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OrderPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    gender: "",
    style: "",
    service: "",
    contact: "",
    method: "paypal",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 获取当前登录用户
  const [user, setUser] = useState(null);
  useState(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setMessage("请先登录账号再下单。");

    setLoading(true);
    setMessage("正在处理订单...");

    try {
      // 调用支付 API
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          amount: 70,
          method: form.method,
          type: "order",
        }),
      });

      const data = await res.json();
      if (data.success) {
        // 存储订单信息
        await supabase.from("orders").insert([
          {
            user_id: user.id,
            gender: form.gender,
            style: form.style,
            service: form.service,
            contact: form.contact,
            payment_method: form.method,
            status: "pending",
          },
        ]);
        setMessage("✅ 下单成功！请等待陪聊师接单。");
      } else {
        setMessage("❌ 支付失败，请重试。");
      }
    } catch (err) {
      setMessage("服务器错误，请稍后再试。");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-white py-10 px-6">
      <h1 className="text-3xl font-semibold text-blue-700 mb-6">💬 下单中心</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <label className="block mb-3">
          <span className="text-gray-700">希望陪聊师性别：</span>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">请选择</option>
            <option value="male">男</option>
            <option value="female">女</option>
            <option value="any">不限</option>
          </select>
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">性格偏好：</span>
          <select
            name="style"
            value={form.style}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">请选择</option>
            <option value="gentle">温柔治愈</option>
            <option value="funny">活泼搞笑</option>
            <option value="quiet">安静倾听</option>
            <option value="mature">成熟稳重</option>
          </select>
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">服务类型：</span>
          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="">请选择</option>
            <option value="listening">倾听</option>
            <option value="companionship">陪伴</option>
            <option value="comfort">开导</option>
          </select>
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">联系方式（可选）：</span>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="如微信号 / 邮箱"
            className="mt-1 block w-full border rounded-md p-2"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700">支付方式：</span>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md p-2"
          >
            <option value="paypal">PayPal</option>
            <option value="wechat">微信支付</option>
            <option value="balance">余额支付</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          {loading ? "正在下单..." : "确认支付 $70"}
        </button>
      </form>

      {message && (
        <p className="text-center text-gray-700 mt-4 bg-blue-50 border border-blue-100 rounded-md px-4 py-2">
          {message}
        </p>
      )}
    </div>
  );
}