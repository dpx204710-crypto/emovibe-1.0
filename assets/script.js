// assets/script.js
async function checkAuth() {
  const { data } = await supabase.auth.getSession();
  if (!data.session && !window.location.pathname.includes("login.html")) {
    window.location.href = "login.html";
  }
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

checkAuth();
