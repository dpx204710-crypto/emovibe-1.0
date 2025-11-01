import Navbar from "../components/Navbar"

export default function Recharge() {
  return (
    <div className="recharge-page">
      <Navbar />
      <h1>充值中心</h1>
      <p>选择充值方式：</p>
      <div className="recharge-buttons">
        <button>💳 PayPal 支付</button>
        <button>💸 微信支付</button>
      </div>
      <p className="tip">⚠️ 暂不支持提现，充值仅用于角色聊天、礼物赠送等。</p>
    </div>
  )
}
