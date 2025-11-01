import { useState } from 'react';

export default function Register() {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [country,setCountry]=useState('USA');
  const [gender,setGender]=useState('Female');
  const [message,setMessage]=useState('');

  const handleRegister=async()=>{
    const res=await fetch('http://localhost:3000/register',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email,password,name,country,gender})
    });
    const data=await res.json();
    setMessage(data.message||data.error);
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Register</h1>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /><br/>
      <select value={country} onChange={e=>setCountry(e.target.value)}>
        <option value="USA">USA</option>
        <option value="China">China</option>
      </select><br/>
      <select value={gender} onChange={e=>setGender(e.target.value)}>
        <option value="Female">Female</option>
        <option value="Male">Male</option>
        <option value="Other">Other</option>
      </select><br/>
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
    </div>
  )
}
