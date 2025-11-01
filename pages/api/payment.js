export default function handler(req, res) {
  if (req.method === "POST") {
    const { userId, amount } = req.body
    console.log(`用户 ${userId} 充值 ${amount} 元`)
    // 🚧 实际版本可改为调用真实支付API（微信/支付宝/PayPal）
    res.status(200).json({ message: "充值成功", balance: amount })
  } else {
    res.status(405).json({ message: "Method Not Allowed" })
  }
}
