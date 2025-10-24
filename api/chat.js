async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chat-box");
  const message = input.value.trim();
  if (!message) return;

  // 显示用户消息
  const userMsg = document.createElement("div");
  userMsg.classList.add("message", "user");
  userMsg.textContent = "你：" + message;
  chatBox.appendChild(userMsg);
  input.value = "";

  // 滚动到底部
  chatBox.scrollTop = chatBox.scrollHeight;

  // 显示“AI 正在回复...”
  const loadingMsg = document.createElement("div");
  loadingMsg.classList.add("message", "ai");
  loadingMsg.textContent = "Emovibe 正在思考...";
  chatBox.appendChild(loadingMsg);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    loadingMsg.remove();

    const aiMsg = document.createElement("div");
    aiMsg.classList.add("message", "ai");
    aiMsg.textContent = "Emovibe：" + (data.reply || "（AI暂时没反应）");
    chatBox.appendChild(aiMsg);

  } catch (err) {
    console.error("聊天出错:", err);
    loadingMsg.textContent = "（出错了，请稍后再试）";
  }

  // 保持滚动到底
  chatBox.scrollTop = chatBox.scrollHeight;
}