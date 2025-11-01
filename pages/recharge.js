import { useState } from "react"
import Navbar from "../components/Navbar"

export default function Recharge() {
  const [amount, setAmount] = useState(10)
  const [balance, setBalance] = useState(0)

  const handleRecharge = async () => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: "demo-user", amount })
    })
    const data = await res.json()
    alert(data.message)
    setBalance(balance + parseInt(amount))
  }

  return (
    <div className="recharge-page">
      <Navbar />
      <h1>充值中心</h1>
      <p>当前余额：<strong>{balance}</strong> 元</p>
      <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} />
      <button onClick={handleRecharge}>确认充值</button>
      <p>（目前为模拟充值接口，可接真实支付API）</p>
    </div>
  )
}