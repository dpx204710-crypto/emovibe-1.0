import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding:'2rem', fontFamily:'Arial'}}>
      <h1>Emovibe - Professional Emotional Support</h1>
      <p>Connect with AI or professional counselors worldwide.</p>
      <nav>
        <Link href="/register">Register</Link> |{' '}
        <Link href="/login">Login</Link> |{' '}
        <Link href="/chat">Chat</Link> |{' '}
        <Link href="/treehole">Tree Hole</Link> |{' '}
        <Link href="/membership">Membership</Link>
      </nav>
    </div>
  );
}
