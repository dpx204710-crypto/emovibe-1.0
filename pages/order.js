import { useState } from 'react';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function OrderPage() {
  const router = useRouter();
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function handleOrder() {
    setLoading(true);
    setMessage('');

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      setMessage('请先登录账号');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: user.id,
        requirements,
      }),
    });

    const data = await response.json();

    if (data.success) {
      router.push(`/chatroom?room=${data.roomId}`);
    } else {
      setMessage(data.error || '创建订单失败');
    }

    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '80px auto', padding: 20 }}>
      <h2>💬 创建陪聊订单</h2>
      <textarea
        placeholder="描述你的需求（如：希望一个温柔的女生倾听我的烦恼）"
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        style={{
          width: '100%',
          height: 120,
          padding: 10,
          borderRadius: 8,
          border: '1px solid #ccc',
          marginTop: 10,
        }}
      />
      <button
        onClick={handleOrder}
        disabled={loading}
        style={{
          background: '#3B82F6',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: 8,
          marginTop: 15,
          cursor: 'pointer',
        }}
      >
        {loading ? '匹配中...' : '立即匹配陪聊师'}
      </button>
      {message && <p style={{ color: 'red', marginTop: 10 }}>{message}</p>}
    </div>
  );
}