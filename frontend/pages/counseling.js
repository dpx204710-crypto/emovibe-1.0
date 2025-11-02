import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Counseling(){
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const [question,setQuestion] = useState('');
  const [reply,setReply] = useState('');
  const [resources,setResources] = useState([]);

  useEffect(()=> {
    axios.get(`${API}/counseling-resources?locale=en-US`).then(r=>setResources(r.data.resources || [])).catch(()=>{});
  },[]);

  const ask = async () => {
    if(!question.trim()) return alert('Please ask a question / 请先输入问题');
    setReply('...');
    try{
      const res = await axios.post(`${API}/counseling`, { question, locale:'en-US' });
      if(res.data.success) setReply(res.data.reply);
      else setReply('No response');
    }catch(err){ console.error(err); setReply('Error'); }
  };

  return (
    <div className="container">
      <div style={{maxWidth:1000,margin:'24px auto',display:'flex',gap:20}}>
        <div style={{flex:1}}>
          <h2>Counseling · 心理疏导（AI辅助）</h2>
          <p className="small-muted">Supportive guidance. Not a replacement for professional help. 如遇紧急情况请联系当地紧急热线。</p>
          <textarea className="form-input" rows={6} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Describe how you feel... / 描述你的感受..." />
          <div style={{marginTop:8}}>
            <button className="btn btn-primary" onClick={ask}>Get Support / 获取支持</button>
          </div>
          <div style={{marginTop:12,whiteSpace:'pre-wrap'}}>{reply}</div>
        </div>

        <aside style={{width:320}}>
          <div className="card">
            <h4>Resources · 心理资源</h4>
            {resources.map(r=>(
              <div key={r.id} style={{marginTop:8}}>
                <a href={r.url} target="_blank" rel="noreferrer">{r.title}</a>
                <div className="small-muted">{r.type}</div>
              </div>
            ))}
            <hr/>
            <div className="small-muted">If you are in immediate danger, contact local emergency services. / 若遇紧急情况请拨打当地急救电话。</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
