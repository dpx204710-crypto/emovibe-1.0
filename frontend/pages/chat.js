// frontend/pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#f5faff', color: '#333' }}>
      <header style={{ backgroundColor: '#007bff', color: 'white', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 700 }}>EmoVibe</div>
        <nav>
          <Link href="/chat" style={{ color: 'white', marginLeft: '20px', textDecoration: 'none', fontWeight: 500 }}>聊天室</Link>
          <Link href="/ai" style={{ color: 'white', marginLeft: '20px', textDecoration: 'none', fontWeight: 500 }}>AI自定义角色</Link>
          <Link href="/membership" style={{ color: 'white', marginLeft: '20px', textDecoration: 'none', fontWeight: 500 }}>充值会员</Link>
          <Link href="/contact" style={{ color: 'white', marginLeft: '20px', textDecoration: 'none', fontWeight: 500 }}>联系我们</Link>
        </nav>
      </header>

      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '80vh', textAlign: 'center',
        background: 'linear-gradient(135deg, #e0f0ff, #cce5ff)'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#007bff' }}>专业情感陪聊平台</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px', maxWidth: '600px' }}>
          与真人或AI陪聊，分享你的心情，结识温暖的人。立即加入会员，享受专属陪聊体验。
        </p>
        <div>
          <Link href="/membership">
            <button style={{ padding: '15px 30px', fontSize: '18px', margin: '5px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white' }}>
              开通会员 $99/周
            </button>
          </Link>
          <Link href="/ai">
            <button style={{ padding: '15px 30px', fontSize: '18px', margin: '5px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: '#00c8ff', color: 'white' }}>
              AI自定义角色
            </button>
          </Link>
        </div>
      </section>

      <section style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '60px 20px', flexWrap: 'wrap' }}>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '250px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: '#007bff' }}>真人陪聊</h3>
          <p>专业陪聊师倾听你的心声，给予温暖和建议。</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '250px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: '#007bff' }}>AI角色陪聊</h3>
          <p>自定义AI陪聊角色，随时随地获得个性化陪伴。</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '250px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: '#007bff' }}>社交分享</h3>
          <p>可选择分享你的社交账号，轻松建立连接与朋友。</p>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e0f0ff', marginTop: '40px' }}>
        &copy; 2025 EmoVibe. All Rights Reserved.
      </footer>
    </div>
  );
}