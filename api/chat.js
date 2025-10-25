// api/chat.js (Node.js serverless)
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body || {};
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: "OpenAI key missing" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 或 gpt-3.5-turbo，根据你需要
        messages: [
          { role: "system", content: "你是 Emovibe 的温柔陪聊助手，专注倾听并给出安抚和建议。" },
          { role: "user", content: message }
        ],
        max_tokens: 512
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "（AI 暂无回答）";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI 请求失败：", err);
    res.status(500).json({ error: "请求出错" });
  }
}