import axios from 'axios';
import { useEffect, useState } from 'react';
import { supabase } from './_app';

export default function Membership(){
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [status,setStatus] = useState(null);

  useEffect(()=>{ (async()=>{
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if(!user) return;
    const res = await axios.get(`${API}/subscription-status?userId=${user.id}`).catch(()=>null);
    setStatus(res?.data || null);
  })(); },[]);

  const checkout = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if(!user) return alert('Please login / 请先登录');
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    try{
      const res = await axios.post(`${API}/create-checkout-session`, { userId: user.id, priceId, successUrl: window.location.href, cancelUrl: window.location.href });
      if(res.data.url) window.location.href = res.data.url;
      else alert('Checkout failed');
    }catch(err){ console.error(err); alert('Checkout error'); }
  };

  return (
    <div className="container">
      <div style={{maxWidth:720,margin:'24px auto'}} className="card">
        <h2>Membership · 会员</h2>
        <p className="small-muted">$99 / week — priority access & premium AI features. / 每周 $99 — 优先服务与高级 AI 功能。</p>
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={checkout}>Subscribe / 订阅</button>
        </div>
        <div style={{marginTop:12}}>Status: {status?.active ? `Active until ${status.expires_at}` : 'Not active / 未激活'}</div>
      </div>
    </div>
  );
}