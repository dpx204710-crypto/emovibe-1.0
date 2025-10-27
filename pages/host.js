import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function HostPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // 登录验证
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/");
      else setUser(data.user);
    });

    fetchOrders();
  }, []);

  // 拉取订单
  async function fetchOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setOrders(data);
  }

  // 接单
  async function handleAccept(orderId) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "accepted", host_id: user.id })
      .eq("id", orderId);

    if (error) alert("接单失败：" + error.message);
    else {
      alert("接单成功！正在跳转聊天页面...");
      router.push(`/chatroom?order=${orderId}`);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎧 陪聊师工作台</h1>
      <p style={styles.subtitle}>欢迎回来，{user?.email}</p>

      <div style={styles.list}>
        {orders.length === 0 ? (
          <p>目前没有新的客户订单。</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <h3>🧍 客户需求</h3>
              <p><b>性别偏好：</b>{order.gender_preference}</p>
              <p><b>服务类型：</b>{order.service_type}</p>
              <p><b>状态：</b>{order.status}</p>
              {order.status === "pending" ? (
                <button
                  style={styles.acceptBtn}
                  onClick={() => handleAccept(order.id)}
                >
                  ✅ 接单
                </button>
              ) : (
                <p style={{ color: "#16a34a" }}>已被接单</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    fontFamily: '"Poppins", sans-serif',
    background: "#f8fafc",
    minHeight: "100vh",
  },
  title: {
    fontSize: 28,
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#475569",
    marginBottom: 30,
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  card: {
    width: 300,
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  acceptBtn: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 10,
  },
};