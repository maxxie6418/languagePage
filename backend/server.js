const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const wordRoutes = require('./routes/words');
const knowledgeRoutes = require('./routes/knowledge');
const ebbinghausRoutes = require('./routes/ebbinghaus');
const quizRoutes = require('./routes/quiz');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/user/ebbinghaus', ebbinghausRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '考研英语学习站服务器运行中' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ error: 'API接口不存在' });
    } else {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`访问文档: http://localhost:${PORT}`);
});
