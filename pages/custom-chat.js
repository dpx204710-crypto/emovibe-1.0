import { useState, useEffect } from 'react';
import { supabase } from './_app';
import Header from '../components/Header';

export default function CustomChat() {
  const [locale, setLocale] = useState('en');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    style: '', language: '', gender: '', request_text: '', contact: ''
  });
  const [msg, setMsg] = useState('');

  const t = (en, zh) => locale === 'en' ? en : zh;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
  }, []);

  async function handleSubmit() {
    if (!user) return setMsg(t('Please login first.', '请先登录。'));
    if (!user.membership_expire) return setMsg(t('This feature is for members only.', '此功能仅限会员使用。'));

    const confirm = window.confirm(t(
      'Reminder: This platform only supports chatting and emotional companionship. Any illegal behavior is prohibited.',
      '提醒：本平台仅限聊天与心理陪伴，禁止任何违法或不当行为。'
    ));
    if (!confirm) return;

    const { error } = await supabase.from('chat_requests').insert([
      { user_id: user.id, ...form }
    ]);
    if (error) setMsg(error.message);
    else setMsg(t('Request submitted successfully!','定制请求已提交成功！'));
  }

  return (
    <>
      <Header locale={locale} setLocale={setLocale} />
      <div style={{ maxWidth: 600, margin: '60px auto', background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2>{t('Custom Real Chat Companion', '定制真人陪聊师')}</h2>
        <p>{t('Fill out your preferred style and contact information. Only members can use this feature.','填写你希望的陪聊师风格与联系方式，仅限会员使用。')}</p>

        <input placeholder={t('Style (gentle, mature, funny...)','风格（温柔、成熟、幽默等）')}
          onChange={e => setForm({ ...form, style: e.target.value })} style={inputStyle} />
        <input placeholder={t('Language','语言')} onChange={e => setForm({ ...form, language: e.target.value })} style={inputStyle} />
        <input placeholder={t('Gender preference','性别偏好')} onChange={e => setForm({ ...form, gender: e.target.value })} style={inputStyle} />
        <textarea placeholder={t('Describe your ideal chat partner','描述你理想的陪聊师')} onChange={e => setForm({ ...form, request_text: e.target.value })} style={{ ...inputStyle, height: 100 }} />
        <input placeholder={t('Your contact (email/social ID)','你的联系方式（邮箱/社交账号）')} onChange={e => setForm({ ...form, contact: e.target.value })} style={inputStyle} />

        <button onClick={handleSubmit} style={btnStyle}>{t('Submit Request','提交定制请求')}</button>
        {msg && <p style={{ marginTop: 12, color: '#007bff' }}>{msg}</p>}
      </div>
    </>
  );
}

const inputStyle = {
  width: '100%', margin: '10px 0', padding: '10px', borderRadius: '6px',
  border: '1px solid #ccc', fontSize: '16px'
};
const btnStyle = {
  background: '#007bff', color: '#fff', border: 'none',
  padding: '12px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px'
};
