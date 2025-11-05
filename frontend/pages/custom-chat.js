// frontend/pages/custom-chat.js
import { useState, useEffect } from 'react';
import { supabase } from './_app';
import Header from '../components/Header';
import axios from 'axios';

export default function CustomChat() {
  const [user, setUser] = useState(null);
  const [locale, setLocale] = useState('en');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    gender: '',
    personality: '',
    description: '',
    contact: ''
  });

  const API = process.env.NEXT_PUBLIC_API_URL || '';

  const t = (en, zh) => (locale === 'en' ? en : zh);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    })();
  }, []);

  async function checkMembership(userId) {
    if (!userId) return false;
    try {
      const res = await axios.get(`${API}/subscription/${userId}`);
      return res.data?.active;
    } catch {
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!user) {
      setMsg(t('Please login first.', '请先登录账号。'));
      return;
    }

    const active = await checkMembership(user.id);
    if (!active) {
      setMsg(t('You must be a member to submit.', '仅限会员可使用此功能。'));
      return;
    }

    try {
      await axios.post(`${API}/custom-request`, {
        user_id: user.id,
        ...form
      });
      setMsg(t('Request submitted successfully!', '定制请求已提交成功！'));
      setForm({ gender: '', personality: '', description: '', contact: '' });
    } catch (err) {
      setMsg(t('Error submitting form.', '提交表单时出错。'));
    }
  }

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '600px', margin: '80px auto', padding: '20px' }}>
        <h1 style={{ color: '#007bff' }}>{t('Custom Real Chat Companion', '定制真人陪聊')}</h1>
        <p>{t('Fill out your preferences below. All text fields are optional and will be matched manually.', '请填写你的陪聊偏好，所有字段均可自定义，平台人工匹配。')}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <input type="text" placeholder={t('Preferred Gender', '期望性别')} value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} />
          <input type="text" placeholder={t('Personality', '性格特点')} value={form.personality} onChange={e => setForm({ ...form, personality: e.target.value })} />
          <textarea placeholder={t('Other requirements or description', '其他要求或描述')} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          <input type="text" placeholder={t('Your contact info (optional)', '你的联系方式（可选）')} value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />

          <p style={{ fontSize: '14px', color: '#888' }}>
            {t('Note: Only for legal text chatting purposes.', '提示：本服务仅限合法文字聊天用途。')}
          </p>

          <button type="submit" style={{ background: '#007bff', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            {t('Submit Request', '提交定制')}
          </button>
        </form>

        {msg && <p style={{ marginTop: '20px', color: '#007bff' }}>{msg}</p>}
      </main>
    </div>
  );
}