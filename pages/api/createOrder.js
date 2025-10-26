import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { customer_id, requirements } = req.body;

  try {
    // 1️⃣ 查找随机陪聊师
    const { data: companions, error: companionError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'companion')
      .eq('online', true);

    if (companionError) throw companionError;
    if (!companions || companions.length === 0) {
      return res.status(400).json({ error: '当前没有在线的陪聊师' });
    }

    const randomCompanion = companions[Math.floor(Math.random() * companions.length)];

    // 2️⃣ 创建订单
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          customer_id,
          companion_id: randomCompanion.id,
          requirements,
          status: 'matched',
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3️⃣ 创建聊天房间
    const { data: roomData, error: roomError } = await supabase
      .from('chat_rooms')
      .insert([
        {
          order_id: orderData.id,
          customer_id,
          companion_id: randomCompanion.id,
        },
      ])
      .select()
      .single();

    if (roomError) throw roomError;

    // 4️⃣ 返回房间ID
    res.status(200).json({
      success: true,
      roomId: roomData.id,
      companion: randomCompanion,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}