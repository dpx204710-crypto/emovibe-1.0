import { useState, useEffect } from 'react';

export default function TreeHole() {
  const [content,setContent]=useState('');
  const [posts,setPosts]=useState([]);

  useEffect(()=>{
    async function fetchData(){
      const res=await fetch('http://localhost:3000/tree_holes');
      const data=await res.json();
      setPosts(data);
    }
    fetchData();
  },[]);

  const postTreeHole=async()=>{
    const res=await fetch('http://localhost:3000/tree_holes',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({user_id:'user1',content})
    });
    const data=await res.json();
    setPosts([data,...posts]);
    setContent('');
  }

  return (
    <div style={{padding:'2rem'}}>
      <h1>Tree Hole</h1>
      <textarea value={content} onChange={e=>setContent(e.target.value)} /><br/>
      <button onClick={postTreeHole}>Post</button>
      <div style={{marginTop:'1rem'}}>
        {posts.map((p,i)=><p key={i}>{p.anonymous?'Anonymous':p.user_id}: {p.content}</p>)}
      </div>
    </div>
  )
}
