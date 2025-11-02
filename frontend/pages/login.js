import { supabase } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return alert(error.message);
    router.push('/');
  };

  return (
    <div className="container">
      <div style={{maxWidth:480,margin:'36px auto'}} className="card">
        <h3>Login / 登录</h3>
        <input className="form-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={handleLogin}>Login / 登录</button>
        </div>
      </div>
    </div>
  );
}