import Link from 'next/link';
import styles from '../styles/global.css';

export default function Home() {
  return (
    <div className="page">
      <header className="header">
        <div className="logo">EmoVibe</div>
        <nav>
          <Link href="/chat" className="navlink">Chat</Link>
          <Link href="/ai-create" className="navlink">Create AI</Link>
          <Link href="/membership" className="navlink">Membership</Link>
        </nav>
      </header>

      <section className="hero">
        <h1>Professional Emotional Companion Platform</h1>
        <p>Share your thoughts with AI or real people who truly listen.  
        Create your own AI companion today and start a meaningful journey.</p>
        <div className="btn-group">
          <Link href="/membership"><button className="btn primary">Join Now - $99/week</button></Link>
          <Link href="/ai-create"><button className="btn secondary">Create AI Character</button></Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <img src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png" width="60"/>
          <h3>Real Companionship</h3>
          <p>Chat with professional human listeners anytime you need support.</p>
        </div>
        <div className="feature">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712100.png" width="60"/>
          <h3>Custom AI Roles</h3>
          <p>Design AI companions that match your ideal personality.</p>
        </div>
        <div className="feature">
          <img src="https://cdn-icons-png.flaticon.com/512/4144/4144725.png" width="60"/>
          <h3>Safe & Private</h3>
          <p>All your conversations are encrypted and secure.</p>
        </div>
      </section>

      <footer className="footer">
        &copy; 2025 EmoVibe. Built for comfort & connection.
      </footer>
    </div>
  );
}