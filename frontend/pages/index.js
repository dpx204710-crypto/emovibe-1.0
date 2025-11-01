import Link from 'next/link';

export default function Home() {
  return (
    <div style={{padding:'2rem'}}>
      <h1>Welcome to Emovibe</h1>
      <p>Professional emotional support platform</p>
      <nav>
        <Link href="/register"><a>Register</a></Link> | 
        <Link href="/login"><a>Login</a></Link> | 
        <Link href="/chat"><a>Chat</a></Link> | 
        <Link href="/treehole"><a>Tree Hole</a></Link> | 
        <Link href="/membership"><a>Membership</a></Link>
      </nav>
    </div>
  )
}