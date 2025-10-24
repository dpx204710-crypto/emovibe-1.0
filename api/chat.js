export default async function handler(req, res) {
  // 限制只允许 POST 请求
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 从请求中取出用户消息
  const { message } = req.body;

  // 从 Vercel 环境变量中读取 OpenAI Key
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "缺少 OPENAI_API_KEY 环境变量" });
  }

  try {
    // 请求 OpenAI ChatGPT API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "你是 Emovibe，一个温柔、积极、治愈系的AI朋友，会用温暖、真诚、鼓励的语气与用户聊天。" },
          { role: "user", content: message },
        ],
      }),
    });

    // 解析返回结果
    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      throw new Error("AI 没有返回结果");
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI 请求失败：", err);
    res.status(500).json({ error: "请求出错，请稍后再试。" });
  }
}
