import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    setMessage(error ? error.message : 'Signup successful! Please check your email.');
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Sign Up</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={handleSignup}>Register</button>
      <p>{message}</p>
    </div>
  );
}
