import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "只支持 POST" });

  const { user_id, ai_id, reward } = req.body;

  try {
    // 奖励心币
    const { error } = await supabase
      .from("ai_profiles")
      .update({ coins: supabase.rpc("increment", { x: reward }) })
      .eq("id", ai_id);

    if (error) throw error;

    res.status(200).json({ message: `奖励 ${reward} 💛 心币成功` });
  } catch (err) {
    console.error("奖励失败：", err);
    res.status(500).json({ error: "心币系统错误" });
  }
}
