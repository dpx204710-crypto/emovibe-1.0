// 文件：frontend/pages/index.jsx
import React from 'react';

const features = [
  {
    title: "真人陪聊",
    description: "选择陪聊师，定制国家、性别、性格，享受专属陪伴",
    button: "立即开始",
  },
  {
    title: "AI 定制角色",
    description: "自定义AI聊天角色，满足你的个性化需求",
    button: "定制角色",
  },
  {
    title: "树洞",
    description: "匿名倾诉，安全倾听，无人打扰",
    button: "打开树洞",
  },
  {
    title: "心理疏导",
    description: "温暖心理辅导，缓解压力与焦虑",
    button: "了解更多",
  },
];

export default function Home() {
  return (
    <div className="font-poppins text-gray-800">
      {/* 导航栏 */}
      <nav className="flex justify-between items-center py-6 px-12 bg-white fixed w-full z-50 shadow-md">
        <div className="text-2xl font-bold text-blue-900 flex items-center">
          <span className="mr-2">💙</span>Emovibe
        </div>
        <div className="space-x-6 text-blue-900 font-semibold">
          <a href="#features" className="hover:text-orange-500">首页</a>
          <a href="#chat" className="hover:text-orange-500">陪聊</a>
          <a href="#ai" className="hover:text-orange-500">AI 定制角色</a>
          <a href="#treehole" className="hover:text-orange-500">树洞</a>
          <a href="#psychology" className="hover:text-orange-500">心理疏导</a>
          <a href="/login" className="hover:text-orange-500">登录</a>
          <a href="/register" className="hover:text-orange-500">注册</a>
        </div>
      </nav>

      {/* Hero 区 */}
      <section className="h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-blue-900">
          随时陪伴，温暖倾听
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-700 max-w-2xl">
          真人陪聊 + AI 定制角色，满足你的每一次心情需求。
        </p>
        <div className="space-x-4">
          <a href="#chat" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition">
            开始陪聊
          </a>
          <a href="#features" className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition">
            了解更多
          </a>
        </div>
      </section>

      {/* 核心功能模块 */}
      <section id="features" className="py-20 bg-gray-100">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">核心功能</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {features.map((f, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
              <h3 className="text-2xl font-semibold mb-4">{f.title}</h3>
              <p className="text-gray-700 mb-6">{f.description}</p>
              <a href="#chat" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition">{f.button}</a>
            </div>
          ))}
        </div>
      </section>

      {/* 会员订阅区 */}
      <section id="membership" className="py-20 bg-white text-center px-4">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">加入 Emovibe 会员，一周 $99 美金</h2>
        <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
          专属真人陪聊 | AI 自定义角色无限使用 | 树洞 & 心理疏导特权
        </p>
        <a href="/subscribe" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 px-8 rounded-lg transition">
          立即开通会员
        </a>
        <p className="mt-4 text-gray-500 text-sm">支付安全，支持 Stripe/PayPal</p>
      </section>

      {/* 信任与品牌区 */}
      <section id="trust" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 text-center">
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">隐私保障</h4>
            <p className="text-gray-600">聊天内容加密，用户匿名</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">安全支付</h4>
            <p className="text-gray-600">支持 Stripe/PayPal</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">专业陪聊</h4>
            <p className="text-gray-600">真人陪聊师审核上线</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">免责声明</h4>
            <p className="text-gray-600">心理疏导非专业医疗，仅做心灵陪伴</p>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-blue-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Emovibe. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="hover:text-orange-500">隐私政策</a>
            <a href="/terms" className="hover:text-orange-500">用户协议</a>
            <a href="mailto:support@emovibe.com" className="hover:text-orange-500">客服邮箱</a>
          </div>
        </div>
      </footer>
    </div>
  );
}