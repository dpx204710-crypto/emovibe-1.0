import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Treehole(){
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [content,setContent]=useState('');
  const [mood,setMood]=useState('');
  const [posts,setPosts]=useState([]);

  const fetchPosts = async ()=> {
    try {
      const res = await axios.get(`${API}/treehole?limit=200`);
      setPosts(res.data.posts || []);
    } catch (err) { console.error(err); }
  };

  useEffect(()=>{ fetchPosts(); },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!content.trim()) return alert('Please write something / 请写点内容');
    try {
      await axios.post(`${API}/treehole`, { content: content.trim(), mood });
      setContent(''); setMood('');
      fetchPosts();
      alert('Posted anonymously / 匿名发布成功');
    } catch (err) { console.error(err); alert('Failed to post / 发布失败'); }
  };

  return (
    <div className="container">
      <div style={{maxWidth:800,margin:'24px auto'}}>
        <h2>Treehole · 匿名树洞</h2>
        <form onSubmit={handleSubmit}>
          <textarea className="form-input" rows={5} value={content} onChange={e=>setContent(e.target.value)} placeholder="Share your feelings anonymously... / 匿名分享你的心情..." />
          <input className="form-input" placeholder="Mood (optional) / 情绪（可选）" value={mood} onChange={e=>setMood(e.target.value)} />
          <div style={{marginTop:8}}>
            <button className="btn btn-primary" type="submit">Post Anonymously / 匿名发布</button>
          </div>
        </form>

        <hr style={{margin:'20px 0'}}/>
        <h3>Recent posts / 最新帖子</h3>
        <div>
          {posts.map(p=>(
            <div key={p.id} className="card" style={{marginTop:12}}>
              <div className="small-muted">{new Date(p.created_at).toLocaleString()}</div>
              <div style={{marginTop:8}}>{p.content}</div>
              {p.mood && <div className="small-muted" style={{marginTop:6}}>Mood: {p.mood}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}