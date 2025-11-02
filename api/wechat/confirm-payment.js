// frontend/pages/api/wechat/confirm-payment.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ error: 'Missing paymentId' });

    // 1. 查找 payment 记录
    const { data: payment } = await supabase.from('payments').select('*').eq('id', paymentId).single();
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    const userId = payment.user_id;

    // 2. 更新为已支付
    await supabase.from('payments').update({ status: 'completed' }).eq('id', paymentId);

    // 3. 延长会员期 7天
    const now = new Date();
    const { data: user } = await supabase.from('users').select('membership_expires_at').eq('id', userId).single();
    let base = user?.membership_expires_at ? new Date(user.membership_expires_at) : now;
    if (base < now) base = now;
    const newExpiry = new Date(base.getTime() + 7 * 24 * 3600 * 1000).toISOString();

    await supabase.from('users').update({ membership_expires_at: newExpiry }).eq('id', userId);

    res.status(200).json({ success: true, newExpiry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
