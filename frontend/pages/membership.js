import { useState } from 'react';

export default function Membership() {
  const [message,setMessage]=useState('');

  const buyWeekly=async()=>{
    const res=await fetch('http://localhost:3000/membership',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({user_id:'user1',type:'weekly',price:99})
    });
    const data=await res.json();
    setMessage('Weekly membership activated!');
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Membership</h1>
      <p>Weekly Membership: $99</p>
      <button onClick={buyWeekly}>Buy Weekly</button>
      <p>{message}</p>
    </div>
  )
}
