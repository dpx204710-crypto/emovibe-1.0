import { createClient } from "@supabase/supabase-js";

// ✅ 初始化 Supabase（后端环境）
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ⚡ 模拟支付接口
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "仅支持 POST 请求" });

  try {
    const { user_id, amount, method, type } = req.body; 
    // type: "order" | "withdraw"

    if (!user_id || !amount || !method) {
      return res.status(400).json({ error: "参数不完整" });
    }

    // 模拟支付成功
    const transaction = {
      user_id,
      amount,
      method, // "paypal" | "wechat" | "balance"
      type,   // "order" | "withdraw"
      status: "success",
      created_at: new Date().toISOString(),
    };

    // 插入到 Supabase
    const { error } = await supabase.from("transactions").insert([transaction]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "存储交易记录失败" });
    }

    // 模拟返回支付链接 / 成功信息
    return res.status(200).json({
      success: true,
      message: `✅ ${method.toUpperCase()} 支付成功`,
      transaction,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "服务器异常" });
  }
}
