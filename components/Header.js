import Link from 'next/link';

export default function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      background: 'white',
      borderBottom: '1px solid #ddd',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 30px',
      zIndex: 10
    }}>
      <h2 style={{ color: '#007bff' }}>Emovibe</h2>
      <nav style={{ display: 'flex', gap: '20px' }}>
        <Link href="/">Home</Link>
        <Link href="/custom-chat">Real Chat</Link>
        <Link href="/ai-companion">AI Chat</Link>
      </nav>
    </header>
  );
}