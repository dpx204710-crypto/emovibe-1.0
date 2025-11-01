import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages,setMessages]=useState([]);
  const [input,setInput]=useState('');
  const roleId = 'put-alice-role-id-here';
  const userId = '29eb0c59-5baf-4417-a71b-1d7a301aec8e';

  useEffect(()=>{ fetchHistory() },[]);

  const fetchHistory = async ()=>{
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-history?roleId=${roleId}&userId=${userId}`);
    setMessages(res.data.messages);
  }

  const handleSend = async ()=>{
    if(!input) return;
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {message:input, roleId, user_id:userId});
    setMessages([...messages,{sender:'user',message:input},{sender:'ai',message:res.data.reply}]);
    setInput('');
  }

  return (
    <div style={{fontFamily:'Roboto, sans-serif',maxWidth:'600px',margin:'20px auto'}}>
      <h2 style={{textAlign:'center',color:'#007bff'}}>Chat with AI</h2>
      <div style={{border:'1px solid #ccc',borderRadius:'10px',padding:'10px',height:'400px',overflowY:'scroll',background:'#f5faff'}}>
        {messages.map((m,i)=>(
          <div key={i} style={{textAlign:m.sender==='user'?'right':'left',margin:'10px 0'}}>
            <div style={{
              display:'inline-block',
              padding:'10px 15px',
              borderRadius:'20px',
              background:m.sender==='user'?'#007bff':'#e0f0ff',
              color:m.sender==='user'?'white':'#007bff',
              maxWidth:'70%'
            }}>
              {m.message}
            </div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',marginTop:'10px'}}>
        <input value={input} onChange={e=>setInput(e.target.value)} style={{flex:1,padding:'10px',borderRadius:'8px',border:'1px solid #ccc'}} />
        <button onClick={handleSend} style={{marginLeft:'10px',padding:'10px 20px',borderRadius:'8px',border:'none',background:'#007bff',color:'white',cursor:'pointer'}}>Send</button>
      </div>
    </div>
  )
}