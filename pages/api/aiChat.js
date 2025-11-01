export default async function handler(req, res) {
  const { message } = req.body
  // 模拟AI回复（后面可以接OpenAI API）
  const reply = `AI小暖：我明白你的意思，“${message}” 让我有点感触呢。`
  res.status(200).json({ reply })
}
