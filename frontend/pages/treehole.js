import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export default function TreeHole() {
  const [holes,setHoles] = useState([]);
  const [content,setContent] = useState('');

  const fetchHoles = async ()=>{
    const res = await fetch(`${API_BASE_URL}/tree_holes`);
    const data = await res.json();
    setHoles(data);
  }

  const postHole = async ()=>{
    if(!content) return;
    await fetch(`${API_BASE_URL}/tree_holes`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({user_id:'user1', content})
    });
    setContent('');
    fetchHoles();
  }

  useEffect(()=>{ fetchHoles() },[]);

  return (
    <div style={{padding:'2rem'}}>
      <h1>Tree Hole</h1>
      <textarea value={content} onChange={e=>setContent(e.target.value)} rows={3} cols={50}></textarea><br/>
      <button onClick={postHole}>Post</button>
      <div style={{marginTop:'1rem'}}>
        {holes.map(h=>(
          <div key={h.id} style={{border:'1px solid #ccc',padding:'0.5rem',margin:'0.5rem 0'}}>
            {h.content}
          </div>
        ))}
      </div>
    </div>
  )
}