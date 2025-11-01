const API_URL = 'http://localhost:4000/api';

export async function fetchMessages(chatId) {
  const res = await fetch(`${API_URL}/chat/${chatId}`);
  return res.json();
}

export async function sendMessage(chatId, userId, text) {
  await fetch(`${API_URL}/chat/${chatId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, text }),
  });
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
