export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "仅支持 POST 请求" });
  }

  const { message, character } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "服务器缺少 OpenAI 密钥" });
  }

  try {
    // 生成角色系统提示
    const systemPrompt = `
你现在是一名陪聊AI，名叫「${character.name || "小暖"}」。
你的性格是：${character.personality || "温柔体贴"}。
你的聊天风格是：${character.style || "像朋友一样"}。
你的目标是温柔地安慰、倾听、鼓励用户，让对方感到放松和被理解。
回答要自然、真诚、有温度。
`;

    // 向 OpenAI 发送聊天请求
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    // 安全取内容
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "（AI暂时没反应，请稍后重试）";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("OpenAI请求失败：", err);
    res.status(500).json({ error: "服务器处理失败" });
  }
}