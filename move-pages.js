const fs = require('fs');
const path = require('path');

const frontendPagesDir = path.join(__dirname, 'frontend/pages');
const rootPagesDir = path.join(__dirname, 'pages');

// 1. 创建根目录 pages（如果不存在）
if (!fs.existsSync(rootPagesDir)) {
  fs.mkdirSync(rootPagesDir, { recursive: true });
  console.log('Created root pages directory.');
}

// 2. 读取 frontend/pages 下的文件
const files = fs.readdirSync(frontendPagesDir);

// 3. 移动文件到根目录 pages
files.forEach(file => {
  const srcPath = path.join(frontendPagesDir, file);
  const destPath = path.join(rootPagesDir, file);

  // 如果目标文件存在，先删除
  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath);
  }

  fs.renameSync(srcPath, destPath);
  console.log(`Moved: ${file}`);
});

console.log('All frontend/pages files moved to root pages directory.');