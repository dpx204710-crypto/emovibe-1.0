// frontend/pages/register.js
import { supabase } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const router=useRouter();

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert('Check email for confirmation (if enabled).');
    router.push('/login');
  };

  return (
    <div className="container">
      <div style={{maxWidth:420,margin:'40px auto'}} className="card">
        <h3>Register</h3>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',padding:8,margin:'8px 0'}}/>
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%',padding:8,margin:'8px 0'}}/>
        <button className="btn btn-primary" onClick={handleRegister}>Register</button>
      </div>
    </div>
  )
}