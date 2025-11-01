import { useState } from 'react';

export default function Chat() {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');

  const sendMessage=async()=>{
    if(!input) return;
    const res=await fetch('http://localhost:3000/chat',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id:'test',user_id:'user1',text:input,type:'user'})
    });
    const data=await res.json();
    setMessages([...messages,...data]);
    setInput('');
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Chat</h1>
      <div style={{border:'1px solid #ccc',padding:'1rem',height:'300px',overflowY:'scroll'}}>
        {messages.map((m,i)=>(
          <div key={i} style={{textAlign:m.type==='user'?'right':'left',margin:'0.5rem 0'}}>
            <span style={{background:m.type==='user'?'#cce5ff':'#f1f0f0',padding:'0.5rem 1rem',borderRadius:'15px',display:'inline-block'}}>{m.text}</span>
          </div>
        ))}
      </div>
      <input value={input} onChange={e=>setInput(e.target.value)} style={{width:'80%'}}/>
      <button onClick={sendMessage}>Send</button>
    </div>
  )
}
