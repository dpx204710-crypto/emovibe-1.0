// frontend/pages/custom-chat.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from './_app';
import Header from '../components/Header';

export default function CustomChat() {
  const [locale, setLocale] = useState('en');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ style:'', language:'', gender_pref:'', request_text:'', contact:'' });
  const [msg, setMsg] = useState('');
  const API = process.env.NEXT_PUBLIC_API_URL || '/api';
  const t = (en, zh) => locale === 'en' ? en : zh;

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    })();
  }, []);

  async function checkMembership(userId) {
    if (!userId) return false;
    try {
      const res = await axios.get(`${API}/subscription-status?userId=${userId}`);
      return res.data?.active;
    } catch (e) { return false; }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg('');
    if (!user) { setMsg(t('Please login first','请先登录')); return; }

    const isMember = await checkMembership(user.id);
    if (!isMember) { setMsg(t('Members only. Please subscribe.','仅限会员使用，请开通会员')); return; }

    // Show confirmation (legal)
    const ok = confirm(t(
      'Reminder: requests are for chatting and companionship only. Illegal activity is strictly forbidden. Do you confirm?',
      '提醒：定制仅限聊天与心理陪伴，严禁违法或不当行为。你确认吗？'
    ));
    if (!ok) return;

    try {
      const payload = { ...form, user_id: user.id };
      const res = await axios.post(`${API}/chat-requests`, payload);
      setMsg(t('Request submitted. We will notify you when a companion accepts.','定制已提交，陪聊师接单后会通知你。'));
      setForm({ style:'', language:'', gender_pref:'', request_text:'', contact:'' });
    } catch (err) {
      console.error(err);
      setMsg(t('Submit failed.','提交失败'));
    }
  }

  return (
    <>
      <Header locale={locale} setLocale={setLocale} />
      <div style={{maxWidth:720,margin:'36px auto',padding:20,borderRadius:12,background:'#fff',boxShadow:'0 8px 24px rgba(0,0,0,0.06)'}}>
        <h2>{t('Customize a Real Companion','定制真人陪聊师')}</h2>
        <p className="small-muted">{t('Fill your preference. Only members can submit.','填写你的偏好，仅限会员提交。')}</p>

        <form onSubmit={handleSubmit} style={{display:'grid',gap:10,marginTop:12}}>
          <input placeholder={t('Style (gentle, funny, calm...)','风格（温柔、幽默、平和...)')} value={form.style}
            onChange={e=>setForm({...form, style:e.target.value})} className="form-input" />
          <input placeholder={t('Language (English, 中文)','语言')} value={form.language}
            onChange={e=>setForm({...form, language:e.target.value})} className="form-input" />
          <input placeholder={t('Gender preference (optional)','性别偏好（可选）')} value={form.gender_pref}
            onChange={e=>setForm({...form, gender_pref:e.target.value})} className="form-input" />
          <textarea placeholder={t('Describe your ideal companion (what to talk about) - be respectful','描述你理想的陪聊师（想聊什么） — 请遵守合规')} value={form.request_text}
            onChange={e=>setForm({...form, request_text:e.target.value})} className="form-input" rows={6} />
          <input placeholder={t('Contact (email, Telegram, WeChat...) - optional','联系方式（邮箱/Telegram/微信） — 可选')} value={form.contact}
            onChange={e=>setForm({...form, contact:e.target.value})} className="form-input" />

          <div style={{display:'flex',gap:12,alignItems:'center',marginTop:8}}>
            <button className="btn btn-primary" type="submit">{t('Submit Request','提交定制请求')}</button>
            <div style={{color:'#666',fontSize:13}}>{t('Note: Only chat & legal interactions allowed.','注：仅限聊天与合法互动。')}</div>
          </div>
        </form>

        {msg && <div style={{marginTop:12,color:'#007bff'}}>{msg}</div>}
      </div>
    </>
  );
}
