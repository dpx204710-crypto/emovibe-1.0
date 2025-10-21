// === Emovibe 双语语言切换 ===

const translations = {
  zh: {
    home: "首页",
    login: "登录",
    join: "加入我们",
    welcome: "让生活充满温暖",
    desc: "在 Emovibe，每个人都值得被倾听。匿名倾诉，温暖陪伴，情感连接从这里开始。",
    start: "开始聊天"
  },
  en: {
    home: "Home",
    login: "Login",
    join: "Join Us",
    welcome: "Let Life Be Filled With Warmth",
    desc: "At Emovibe, everyone deserves to be heard. Share your feelings, find comfort, and connect emotionally.",
    start: "Start Chat"
  }
};

const languageSwitch = document.getElementById("language-switch");
const elements = document.querySelectorAll("[data-lang]");

function setLanguage(lang) {
  elements.forEach(el => {
    const key = el.getAttribute("data-lang");
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);
}

languageSwitch.addEventListener("change", (e) => {
  setLanguage(e.target.value);
});

window.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("lang") || "zh";
  languageSwitch.value = savedLang;
  setLanguage(savedLang);
});