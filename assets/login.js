// Emovibe 登录逻辑
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const messageBox = document.getElementById("login-message");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
      showMessage("请输入用户名和密码 / Please enter username and password", "error");
      return;
    }

    // 模拟登录验证
    if (username === "demo" && password === "123456") {
      showMessage("登录成功！/ Login Successful!", "success");
      setTimeout(() => {
        window.location.href = "chat.html"; // 登录成功后跳转聊天页面
      }, 1000);
    } else {
      showMessage("用户名或密码错误 / Invalid username or password", "error");
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.className = type === "success" ? "msg-success" : "msg-error";
  }
});