import { supabase } from './supabase.js';

const modal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const loginForm = document.getElementById('loginForm');

loginBtn.onclick = () => modal.style.display = 'block';
loginForm.onsubmit = async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert('登录失败：' + error.message);
  else {
    alert('登录成功');
    modal.style.display = 'none';
  }
};
