import Navbar from "../components/Navbar"

export default function AIPage() {
  const roles = [
    { name: "温柔倾听者", desc: "善于安慰与倾听你的心声。", image: "/role-images/listener.png" },
    { name: "活力小太阳", desc: "永远充满笑容与正能量！", image: "/role-images/cheerful.png" },
    { name: "沉静暖心者", desc: "像一杯热茶，陪你度过安静的时光。", image: "/role-images/calm.png" }
  ]

  return (
    <div className="ai-page">
      <Navbar />
      <h1>AI 角色中心</h1>
      <div className="roles">
        {roles.map((r, i)=>(
          <div key={i} className="role-card">
            <img src={r.image} alt={r.name} />
            <h3>{r.name}</h3>
            <p>{r.desc}</p>
            <button>选择并聊天</button>
          </div>
        ))}
      </div>
    </div>
  )
}
