const supabaseUrl = "https://lryfufidcxnxdzglbzgq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxyeWZ1ZmlkY3hueGR6Z2xiemdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwMjkzNzQsImV4cCI6MjA3NjYwNTM3NH0.2EeB26Ga2F2o9doXEhUORBB9k2YZniH-LQvZ5BZSBeU";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 拉取陪聊师资料
async function loadCompanions() {
  const { data, error } = await supabase.from("companions").select("*");
  const container = document.getElementById("companionsContainer");

  if (error || !data) {
    container.innerHTML = "<p>加载失败，请稍后再试。</p>";
    return;
  }

  container.innerHTML = data.map(c => `
    <div class="card">
      <img src="${c.avatar_url || 'https://placehold.co/300x300?text=Companion'}" alt="avatar">
      <h3>${c.name}</h3>
      <p>${c.personality}</p>
      <button onclick="startChat(${c.id})">开始聊天</button>
    </div>
  `).join("");
}

// 盲盒逻辑
document.getElementById("openBlindBox").addEventListener("click", async () => {
  const { data, error } = await supabase.from("companions").select("*");
  if (data && data.length > 0) {
    const random = data[Math.floor(Math.random() * data.length)];
    alert(`你匹配到了一位${random.personality}的陪聊师「${random.name}」💛`);
    startChat(random.id);
  }
});

function startChat(id) {
  window.location.href = `chat.html?companion_id=${id}`;
}

loadCompanions();
