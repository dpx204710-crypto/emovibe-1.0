import { useState } from 'react';

export default function Login() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');

  const handleLogin=async()=>{
    const res=await fetch('http://localhost:3000/login',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password})
    });
    const data=await res.json();
    setMessage(data.message||data.error);
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Login</h1>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  )
}
