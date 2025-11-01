// frontend/pages/ai-create.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AICreate() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [personality, setPersonality] = useState('');
  const [catchphrase, setCatchphrase] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);

  const createRole = async () => {
    if (!name.trim() || !personality.trim()) {
      alert('请填写角色名称和性格');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          personality,
          catchphrase,
          interests: interests.split(',').map(i => i.trim())
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('角色创建成功！');
        router.push(`/chat?roleId=${data.roleId}`);
      } else {
        alert('创建失败，请重试');
      }
    } catch (err) {
      console.error(err);
      alert('网络错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>创建你的AI角色</h1>

      <div style={{ marginBottom: '15px' }}>
        <input type="text" placeholder="角色名称" value={name} onChange={e => setName(e.target.value)} 
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input type="text" placeholder="性格/风格" value={personality} onChange={e => setPersonality(e.target.value)} 
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input type="text" placeholder="口头语 (可选)" value={catchphrase} onChange={e => setCatchphrase(e.target.value)} 
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input type="text" placeholder="兴趣（逗号分隔）" value={interests} onChange={e => setInterests(e.target.value)} 
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
      </div>

      <div style={{ textAlign: 'center' }}>
        <button onClick={createRole} disabled={loading} 
          style={{ padding: '15px 30px', fontSize: '18px', borderRadius: '8px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer' }}>
          {loading ? '创建中...' : '创建角色并进入聊天室'}
        </button>
      </div>
    </div>
  );
}