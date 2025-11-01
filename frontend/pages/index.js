import Link from 'next/link';

export default function Home() {
  return (
    <div style={{fontFamily:'Roboto, sans-serif',background:'#f5faff',minHeight:'100vh'}}>
      <header style={{background:'#007bff',color:'white',padding:'20px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{fontSize:'28px',fontWeight:'700'}}>EmoVibe</div>
        <nav>
          <Link href="/chat"><a style={{color:'white',margin:'0 15px'}}>Chat</a></Link>
          <Link href="/ai-create"><a style={{color:'white',margin:'0 15px'}}>Create AI Role</a></Link>
          <Link href="/membership"><a style={{color:'white',margin:'0 15px'}}>Membership</a></Link>
        </nav>
      </header>

      <section style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'70vh',textAlign:'center',background:'linear-gradient(135deg,#e0f0ff,#cce5ff)'}}>
        <h1 style={{fontSize:'48px',marginBottom:'20px',color:'#007bff'}}>Professional Emotional Chat</h1>
        <p style={{fontSize:'20px',marginBottom:'30px',maxWidth:'600px'}}>Chat with real humans or AI, share your feelings, and make meaningful connections. Start your journey today!</p>
        <div>
          <Link href="/membership"><button style={{padding:'15px 30px',margin:'5px',borderRadius:'6px',border:'none',background:'#007bff',color:'white',cursor:'pointer',transition:'0.3s'}}>Join $99/week</button></Link>
          <Link href="/ai-create"><button style={{padding:'15px 30px',margin:'5px',borderRadius:'6px',border:'none',background:'#00c8ff',color:'white',cursor:'pointer',transition:'0.3s'}}>Create AI Role</button></Link>
        </div>
      </section>

      <section style={{display:'flex',justifyContent:'center',gap:'40px',padding:'60px 20px',flexWrap:'wrap'}}>
        <div style={{background:'white',padding:'30px',borderRadius:'12px',width:'250px',boxShadow:'0 4px 10px rgba(0,0,0,0.1)',textAlign:'center'}}>
          <h3 style={{marginBottom:'15px',color:'#007bff'}}>Human Chat</h3>
          <p>Professional chat experts to listen and guide you warmly.</p>
        </div>
        <div style={{background:'white',padding:'30px',borderRadius:'12px',width:'250px',boxShadow:'0 4px 10px rgba(0,0,0,0.1)',textAlign:'center'}}>
          <h3 style={{marginBottom:'15px',color:'#007bff'}}>AI Chat</h3>
          <p>Create your own AI character for personalized companionship anytime.</p>
        </div>
        <div style={{background:'white',padding:'30px',borderRadius:'12px',width:'250px',boxShadow:'0 4px 10px rgba(0,0,0,0.1)',textAlign:'center'}}>
          <h3 style={{marginBottom:'15px',color:'#007bff'}}>Social Sharing</h3>
          <p>Share your social profile optionally to connect with friends easily.</p>
        </div>
      </section>

      <footer style={{textAlign:'center',padding:'20px',background:'#e0f0ff',marginTop:'40px'}}>
        &copy; 2025 EmoVibe. All Rights Reserved.
      </footer>
    </div>
  )
}