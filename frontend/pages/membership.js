import axios from 'axios';
import { supabase } from './_app';
import { useState, useEffect } from 'react';

export default function Membership(){
  const [status,setStatus] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(()=>{ async function f(){ const user = (await supabase.auth.getUser()).data.user; if(!user) return; const res=await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription-status?userId=${user.id}`); setStatus(res.data); } f(); },[]);

  const checkout = async () => {
    setLoading(true);
    const user = (await supabase.auth.getUser()).data.user;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID; // set in env
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
        userId: user.id,
        priceId,
        successUrl: window.location.href,
        cancelUrl: window.location.href
      });
      if (data.url) window.location.href = data.url;
    } catch (err) { console.error(err); alert('Checkout failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="container" style={{paddingTop:24}}>
      <div className="card" style={{maxWidth:720,margin:'0 auto'}}>
        <h2>Membership</h2>
        <p>Weekly subscription $99 — professional companionship and priority access.</p>
        <div>
          <button className="btn btn-primary" onClick={checkout} disabled={loading}>Subscribe $99/week</button>
        </div>
        <div style={{marginTop:12}}>
          <strong>Status:</strong> {status?.active ? 'Active until ' + status.end_date : 'Not active'}
        </div>
      </div>
    </div>
  );
}