// pages/api/wallet/transfer.js
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { fromCharacterId, toCharacterId, amount, initiatedBy } = req.body;

  // basic validation
  if (!fromCharacterId || !toCharacterId || !amount || amount <= 0) {
    return res.status(400).json({ error: '参数错误' });
  }

  try {
    // 事务：检查余额 -> 扣减 -> 增加 -> 记录流水
    const result = await supabase.rpc('transfer_between_characters', {
      from_char: fromCharacterId,
      to_char: toCharacterId,
      amt: amount,
      initiator: initiatedBy
    });

    // 如果你不想写 RPC，也可以实现事务：select -> update -> update -> insert
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
