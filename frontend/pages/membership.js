// frontend/pages/membership.js
import { useState, useEffect } from 'react';

export default function Membership() {
  const [isMember, setIsMember] = useState(false); // 会员状态
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // 用户信息，可从后端获取

  useEffect(() => {
    // 页面加载时获取用户信息和会员状态
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/status`, {
          credentials: 'include'
        });
        const data = await res.json();
        setUser(data.user);
        setIsMember(data.user?.isMember || false);
      } catch (err) {
        console.error('获取用户状态失败', err);
      }
    };
    fetchStatus();
  }, []);

  // 开通会员
  const subscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/membership/subscribe`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setIsMember(true);
        alert('会员开通成功！');
      } else {
        alert('开通失败，请重试');
      }
    } catch (err) {
      console.error(err);
      alert('网络错误，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#007bff', textAlign: 'center', marginBottom: '20px' }}>会员中心</h1>
      
      {user ? (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <p>欢迎, <strong>{user.name}</strong>!</p>
          <p>当前会员状态: <strong style={{ color: isMember ? 'green' : 'red' }}>
            {isMember ? '已开通' : '未开通'}
          </strong></p>
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>正在加载用户信息...</p>
      )}

      {!isMember && (
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={subscribe}
            disabled={loading}
            style={{ padding: '15px 