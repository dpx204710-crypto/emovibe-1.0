// frontend/pages/api/wechat/create-order.js
import { createClient } from '@supabase/supabase-js';

// 用 service_role key 创建 Supabase 管理客户端
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userId, amount = 99 } = req.body;

    // 1. 创建一条待支付记录
    const { data, error } = await supabase.from('payments').insert([{
      user_id: userId,
      provider: 'wechat',
      amount,
      currency: 'CNY',
      status: 'pending'
    }]).select().single();

    if (error) {
      console.error('DB error', error);
      return res.status(500).json({ error });
    }

    // 2. 返回二维码图片地址（在 .env 里配置）
    const qr = process.env.WECHAT_QR_IMAGE_URL || '';
    return res.status(200).json({ success: true, qr, paymentId: data.id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected server error' });
  }
}
