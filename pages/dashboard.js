import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/login");
      else setUser(data.session.user);
    });
  }, []);

  // 获取客户订单
  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data.filter((o) => !o.companion_id)); // 未接单
      setMyOrders(data.filter((o) => o.companion_id === user.id)); // 自己接的
    }
    setLoading(false);
  };

  const acceptOrder = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ companion_id: user.id, status: "accepted" })
      .eq("id", orderId);

    if (!error) fetchOrders();
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return alert("请输入提现金额");
    alert(`提现申请已提交：$${withdrawAmount}，将在24小时内处理`);
    setWithdrawAmount("");
  };

  const gotoChat = (orderId) => {
    router.push(`/chat/${orderId}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>陪聊师控制台 💬</h1>

      {user ? (
        <div>
          <p style={styles.info}>当前登录：{user.email}</p>

          {/* 未接订单 */}
          <section style={styles.section}>
            <h2>📥 可接订单</h2>
            {loading ? (
              <p>加载中...</p>
            ) : orders.length === 0 ? (
              <p>暂无订单。</p>
            ) : (
              orders.map((order) => (
                <div key={order.id} style={styles.card}>
                  <p>客户要求：{order.requirements}</p>
                  <p>服务类型：{order.service_type}</p>
                  <p>预算：${order.price || 70}</p>
                  <button style={styles.button} onClick={() => acceptOrder(order.id)}>
                    接单
                  </button>
                </div>
              ))
            )}
          </section>

          {/* 我的订单 */}
          <section style={styles.section}>
            <h2>💬 我的聊天订单</h2>
            {myOrders.length === 0 ? (
              <p>暂无接单。</p>
            ) : (
              myOrders.map((order) => (
                <div key={order.id} style={styles.card}>
                  <p>客户：{order.client_email}</p>
                  <p>服务类型：{order.service_type}</p>
                  <button style={styles.button} onClick={() => gotoChat(order.id)}>
                    进入聊天
                  </button>
                </div>
              ))
            )}
          </section>

          {/* 提现 */}
          <section style={styles.section}>
            <h2>💵 提现</h2>
            <input
              type="number"
              placeholder="输入提现金额"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              style={styles.input}
            />
            <button style={styles.button} onClick={handleWithdraw}>
              提交提现
            </button>
          </section>
        </div>
      ) : (
        <p>请先登录...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#007bff",
    fontSize: "26px",
    marginBottom: "20px",
  },
  info: { textAlign: "center", color: "#333", marginBottom: "30px" },
  section: {
    background: "#f9f9ff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "25px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
  card: {
    background: "white",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    border: "1px solid #ddd",
  },
  button: {
    background: "#007bff",
    color: "white",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};