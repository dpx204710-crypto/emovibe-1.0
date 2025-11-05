import Header from '../components/Header';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Header />
      <main style={{
        maxWidth: '900px',
        margin: '100px auto',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ color: '#007bff', fontSize: '2.5em' }}>Emovibe 1.0</h1>
        <p style={{ marginTop: '10px', color: '#555' }}>
          Your Emotion Companion Platform — where you can customize human or AI companionship.
        </p>

        <div style={{
          marginTop: '40px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Link href="/custom-chat">
            <button style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 30px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              💬 Custom Real Chat
            </button>
          </Link>

          <Link href="/ai-companion">
            <button style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 30px',
              cursor: 'pointer',
              fontSize: '16px'
            }}>
              🤖 AI Chat Companion
            </button>
          </Link>
        </div>

        <p style={{ marginTop: '40px', fontSize: '14px', color: '#999' }}>
          Emovibe © 2025 — Connect, Feel, Grow.
        </p>
      </main>
    </div>
  );
}