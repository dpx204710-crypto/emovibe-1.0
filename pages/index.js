import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [companions, setCompanions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("companions").select("*").eq("available", true);
      setCompanions(data || []);
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>💙 Emovibe 陪聊平台</h1>
      <p>选择一位陪聊师，让情绪被温柔接住。</p>
      <div style={{ display: "grid", gap: 20 }}>
        {companions.map(c => (
          <div key={c.id} style={{ border: "1px solid #ddd", padding: 16, borderRadius: 10 }}>
            <h3>{c.style} - {c.gender === "female" ? "女" : "男"} {c.age}岁</h3>
            <p>{c.description}</p>
            <p>服务类型：{c.service_type === "listening" ? "倾听" : c.service_type === "companionship" ? "陪伴" : "开导"}</p>
            <button onClick={() => window.location.href = `/order?companion=${c.id}`}>
              下单 · ${c.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
