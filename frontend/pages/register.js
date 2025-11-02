import { supabase } from './_app';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Register(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if(!email || !password) return alert('Please fill email & password / 请填写邮箱和密码');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);
    alert('Check your email for confirmation if required. / 请检查邮箱确认（若已启用）');
    router.push('/login');
  };

  return (
    <div className="container">
      <div style={{maxWidth:480,margin:'36px auto'}} className="card">
        <h3>Register / 注册</h3>
        <input className="form-input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="form-input" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div style={{marginTop:12}}>
          <button className="btn btn-primary" onClick={handleRegister}>Register / 注册</button>
        </div>
      </div>
    </div>
  );
}