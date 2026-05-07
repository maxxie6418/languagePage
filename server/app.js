const express = require('express');
const path = require('path');
const cors = require('cors');

// 路由模块
const basicsRouter = require('./routes/basics');
const examRouter = require('./routes/exam');
const practiceRouter = require('./routes/practice');
const userRouter = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API 路由
app.use('/api/basics', basicsRouter);
app.use('/api/exam', examRouter);
app.use('/api/practice', practiceRouter);
app.use('/api/user', userRouter);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 前端路由 - SPA 支持
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏆 英语学习平台服务器已启动                                ║
║                                                            ║
║   📍 访问地址: http://localhost:${PORT}                       ║
║                                                            ║
║   📚 API 端点:                                             ║
║      - /api/basics/*     基础学习区                        ║
║      - /api/exam/*       考研应用区                        ║
║      - /api/practice/*   试题中心                          ║
║      - /api/user/*       用户进度                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
