const db = require('../config/database');
const https = require('https');
const http = require('http');

function getAiConfig() {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM ai_configs WHERE id = 1', [], (err, row) => {
            err ? reject(err) : resolve(row || {});
        });
    });
}

function callDeepSeek(config, systemPrompt, userMessage) {
    return new Promise((resolve, reject) => {
        const apiKey = config.api_key || process.env.DEEPSEEK_API_KEY;
        const baseUrl = config.base_url || process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
        if (!apiKey) return reject(new Error('API Key 未配置'));
        const url = new URL('/v1/chat/completions', baseUrl);
        const body = JSON.stringify({
            model: config.model || 'deepseek-chat',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            stream: false
        });
        const client = url.protocol === 'https:' ? https : http;
        const req = client.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.choices?.[0]?.message?.content || 'AI 服务返回异常');
                } catch { reject(new Error('AI 响应解析失败')); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

exports.chat = async (req, res) => {
    try {
        const config = await getAiConfig();
        if (!config.is_enabled) return res.status(403).json({ error: 'AI 功能未启用' });
        const { message, systemPrompt } = req.body;
        if (!message) return res.status(400).json({ error: '消息不能为空' });
        const reply = await callDeepSeek(config, systemPrompt || '你是考研英语学习助手，帮助用户学习英语。', message);
        res.json({ reply });
    } catch (error) {
        console.error('AI 调用错误:', error);
        res.status(500).json({ error: error.message || 'AI 服务暂不可用' });
    }
};

exports.grammar = async (req, res) => {
    try {
        const config = await getAiConfig();
        if (!config.is_enabled) return res.status(403).json({ error: 'AI 功能未启用' });
        const { sentence } = req.body;
        if (!sentence) return res.status(400).json({ error: '请输入句子' });
        const reply = await callDeepSeek(config,
            '你是一个英语语法专家。请拆解以下句子的语法结构，用树状图形式标注主谓宾、从句类型，并给出中文翻译。',
            sentence);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: error.message || '语法拆解服务暂不可用' });
    }
};

exports.word = async (req, res) => {
    try {
        const config = await getAiConfig();
        if (!config.is_enabled) return res.status(403).json({ error: 'AI 功能未启用' });
        const { word } = req.body;
        if (!word) return res.status(400).json({ error: '请输入单词' });
        const reply = await callDeepSeek(config,
            '你是一个英语词汇专家。请详细解析单词，包括：词根词缀拆解、核心释义、考研常见搭配、2个真题风格例句。',
            word);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: error.message || '单词解析服务暂不可用' });
    }
};

exports.essay = async (req, res) => {
    try {
        const config = await getAiConfig();
        if (!config.is_enabled) return res.status(403).json({ error: 'AI 功能未启用' });
        const { essay, title } = req.body;
        if (!essay) return res.status(400).json({ error: '请输入作文内容' });
        const prompt = `请按考研英语作文评分标准（内容、结构、语言、字数）对以下作文打分并给出修改建议。\n标题：${title || '未命名'}\n作文：${essay}`;
        const reply = await callDeepSeek(config, '你是一个考研英语作文评分专家。', prompt);
        res.json({ reply });
    } catch (error) {
        res.status(500).json({ error: error.message || '作文批改服务暂不可用' });
    }
};
