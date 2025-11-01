import { useState } from 'react';
import { API_BASE_URL } from '../config';

export default function Membership() {
  const [message,setMessage] = useState('');

  const buyMembership = async (type)=>{
    const price = type==='weekly'?99:399;
    const res = await fetch(`${API_BASE_URL}/membership`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({user_id:'user1', type, price})
    });
    const data = await res.json();
    setMessage(data.id ? `Membership ${type} purchased!` : data.error);
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Membership</h1>
      <button onClick={()=>buyMembership('weekly')}>Weekly $99</button>
      <button onClick={()=>buyMembership('monthly')}>Monthly $399</button>
      <p>{message}</p>
    </div>
  )
}