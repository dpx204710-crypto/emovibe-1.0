import Link from 'next/link';
export default function Home(){
  return (
    <>
      <header className="header">
        <div className="logo">EmoVibe</div>
        <nav className="nav">
          <Link href="/chat"><a>Chat</a></Link>
          <Link href="/ai-create"><a>Create AI</a></Link>
          <Link href="/membership"><a>Membership</a></Link>
        </nav>
      </header>
      <div className="container" style={{display:'flex',gap:24,alignItems:'center',marginTop:32}}>
        <div style={{flex:1}}>
          <h1 style={{color:'var(--blue)',fontSize:40}}>Professional Emotional Companion</h1>
          <p style={{color:'#334155',fontSize:18}}>Create a supportive AI companion or chat with professionals. Your feelings matter — talk anytime.</p>
          <div style={{marginTop:18}}>
            <Link href="/membership"><button className="btn btn-primary" style={{marginRight:12}}>Join $99/week</button></Link>
            <Link href="/ai-create"><button className="btn btn-ghost">Create AI Role</button></Link>
          </div>
        </div>
        <div style={{width:420}}>
          <div className="card">
            <h3 style={{margin:0}}>Why EmoVibe?</h3>
            <ul>
              <li>Personalized AI companions</li>
              <li>Secure, private chats</li>
              <li>Professional listeners (optional)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}