export default function FeatureCard({ title, desc }) {
  return (
    <div style={{background:'#fff',padding:24,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)',textAlign:'center',width:260}}>
      <h3 style={{color:'#007bff',marginBottom:12}}>{title}</h3>
      <p style={{fontSize:14,color:'#333'}}>{desc}</p>
    </div>
  );
}