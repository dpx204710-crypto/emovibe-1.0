const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 模拟数据库
let aiRoles = {};

// 创建角色
app.post('/api/ai-roles', (req, res) => {
  const { name, personality, catchphrase, interests } = req.body;
  const roleId = uuidv4();
  aiRoles[roleId] = { id: roleId, name, personality, catchphrase, interests };
  res.json({ success: true, roleId });
});

// 获取角色信息
app.get('/api/ai-roles/:id', (req, res) => {
  const role = aiRoles[req.params.id];
  if (!role) return res.status(404).json({ success: false, message: '角色不存在' });
  res.json({ role });
});

// 聊天接口
app.post('/api/chat', async (req, res) => {
  const { message, roleId } = req.body;
  const role = aiRoles[roleId];

  if (!role) return res.status(400).json({ reply: '角色不存在，请重新创建' });

  // 这里调用 AI 回复逻辑（可对接 OpenAI）
  const reply = generateAIReply(message, role);

  res.json({ reply });
});

// 示例 AI 回复生成函数
function generateAIReply(userMessage, role) {
  let base = `${role.name}(${role.personality})`;
  if (role.catchphrase) base += `，常说：“${role.catchphrase}”`;
  if (role.interests && role.interests.length > 0) base += `，兴趣包括：${role.interests.join('、')}`;
  // 简单模拟回复
  return `${base}：你说的是 "${userMessage}"，我理解了！`;
}

app.listen(5000, () => console.log('Backend running on port 5000'));