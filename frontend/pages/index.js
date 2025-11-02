import Link from 'next/link';
import { useState } from 'react';

export default function Home(){
  return (
    <>
      <header className="header">
        <div className="logo">EmoVibe</div>
        <nav className="nav">
          <Link href="/"><a>Home / 首页</a></Link>
          <Link href="/ai-create"><a>Create AI / 创建AI</a></Link>
          <Link href="/treehole"><a>Treehole / 树洞</a></Link>
          <Link href="/counseling"><a>Counseling / 疏导</a></Link>
          <Link href="/membership"><a>Membership / 会员</a></Link>
        </nav>
      </header>

      <main className="container">
        <section className="hero">
          <div className="hero-left">
            <h1 className="h-title">EmoVibe — Listen with warmth.<br/>EmoVibe：以温度倾听你的心声</h1>
            <p className="h-sub">Create your personal AI companion or chat with trained listeners. Fast, private & caring. / 创建你的专属 AI 陪伴者，或与专业倾听师交流。快速、私密、暖心。</p>

            <div style={{display:'flex',gap:12}}>
              <Link href="/membership"><button className="btn btn-primary">Join — $99/week / 加入（$99/周）</button></Link>
              <Link href="/ai-create"><button className="btn" style={{border:'1px solid var(--blue)'}}>Create AI / 创建AI</button></Link>
            </div>

            <div style={{marginTop:24}}>
              <div style={{display:'flex',gap:12}}>
                <div className="card" style={{flex:1}}>
                  <h4>AI Companion · 自定义AI</h4>
                  <p className="small-muted">Design personality, catchphrase & interests. / 设定个性、口头禅与兴趣。</p>
                </div>
                <div className="card" style={{flex:1}}>
                  <h4>Anonymous Treehole · 匿名树洞</h4>
                  <p className="small-muted">Post feelings without account. / 匿名发布你的情绪。</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="card">
              <h3 style={{margin:0}}>Quick Start · 快速开始</h3>
              <p className="small-muted">Register with email and create your first AI companion in minutes. / 邮箱注册，几分钟内创建你的 AI 陪伴者。</p>

              <div style={{marginTop:12}}>
                <Link href="/register"><button className="btn btn-primary" style={{width:'100%'}}>Register / 注册</button></Link>
                <Link href="/login"><button className="btn" style={{width:'100%', marginTop:8}}>Login / 登录</button></Link>
              </div>

              <hr style={{margin:'12px 0'}}/>

              <h4 style={{margin:'6px 0'}}>Featured Role / 推荐角色</h4>
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div className="role-card">
                  <img src="/ai-placeholder.png" className="role-avatar" />
                  <div>
                    <div style={{fontWeight:600}}>Alice · 爱丽丝</div>
                    <div className="small-muted">Friendly & calm / 友好且平和</div>
                  </div>
                </div>
                <div style={{marginTop:8}}>
                  <Link href="/chat?roleId=demo"><a className="small-muted">Chat with Alice · 与 Alice 聊天 →</a></Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{marginTop:28}}>
          <h3>What we offer · 我们的服务</h3>
          <div className="grid">
            <div className="feature">
              <h4>Personal AI · 个性化AI</h4>
              <p className="small-muted">Tailored companions for every mood. / 针对情绪定制的陪伴者。</p>
            </div>
            <div className="feature">
              <h4>Confidential Treehole · 匿名树洞</h4>
              <p className="small-muted">Share anonymously, find comfort. / 匿名分享，找到安慰。</p>
            </div>
            <div className="feature">
              <h4>Counseling Resources · 心理疏导</h4>
              <p className="small-muted">AI-guided support + hotline links. / AI 辅助建议 + 危机热线。</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        &copy; 2025 EmoVibe · Not a substitute for medical care. 如遇紧急情况请联系当地紧急热线。
      </footer>
    </>
  )
}