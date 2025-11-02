import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from './_app';
import Link from 'next/link';

export default function Roles(){
  const [roles,setRoles]=useState([]);
  useEffect(async ()=>{
    const user = (await supabase.auth.getUser()).data.user;
    const ownerId = user?.id;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-roles?ownerId=${ownerId}`);
    setRoles(res.data.roles || []);
  },[]);
  return (
    <div className="container" style={{paddingTop:24}}>
      <div className="card" style={{maxWidth:900,margin:'0 auto'}}>
        <h2>Your AI Roles</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12}}>
          {roles.map(r=>(
            <div key={r.id} className="card" style={{padding:12}}>
              <img src={r.avatar_url||'/ai-avatar.png'} style={{width:60,height:60,borderRadius:12}}/>
              <h3>{r.name}</h3>
              <p style={{fontSize:13,color:'#475569'}}>{r.personality}</p>
              <Link href={`/chat?roleId=${r.id}&userId=${r.owner_id}`}><a className="btn btn-primary">Chat</a></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
