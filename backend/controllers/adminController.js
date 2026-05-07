const db = require('../config/database');
const bcrypt = require('bcrypt');

exports.getUsers = async (req, res) => {
    try {
        db.all('SELECT id, username, role, ebbinghaus_reminder_enabled, created_at FROM users ORDER BY id',
            [], (err, rows) => { err ? res.status(500).json({ error: '服务器内部错误' }) : res.json(rows); });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) return res.status(400).json({ error: '请输入新密码' });
        const hash = await bcrypt.hash(newPassword, 10);
        db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, id], function (err) {
            err ? res.status(500).json({ error: '服务器内部错误' }) : res.json({ message: '密码已重置' });
        });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (parseInt(id) === req.user.id) return res.status(400).json({ error: '不能删除自己' });
        const target = await new Promise((resolve, reject) => {
            db.get('SELECT role FROM users WHERE id = ?', [id], (err, row) => {
                err ? reject(err) : resolve(row);
            });
        });
        if (!target) return res.status(404).json({ error: '用户不存在' });
        if (target.role === 'admin') {
            const adminCount = await new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin'], (err, row) => {
                    err ? reject(err) : resolve(row.count);
                });
            });
            if (adminCount <= 1) return res.status(400).json({ error: '无法删除最后一个管理员' });
        }
        db.run('DELETE FROM user_words WHERE user_id = ?', [id]);
        db.run('DELETE FROM user_knowledge WHERE user_id = ?', [id]);
        db.run('DELETE FROM ebbinghaus_records WHERE user_id = ?', [id]);
        db.run('DELETE FROM quiz_records WHERE user_id = ?', [id]);
        db.run('DELETE FROM mistakes WHERE user_id = ?', [id]);
        db.run('DELETE FROM user_word_lists WHERE user_id = ?', [id]);
        db.run('DELETE FROM user_word_flags WHERE user_id = ?', [id]);
        db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
            err ? res.status(500).json({ error: '服务器内部错误' }) : res.json({ message: '用户已删除' });
        });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.getAiConfig = async (req, res) => {
    try {
        db.get('SELECT * FROM ai_configs WHERE id = 1', [], (err, row) => {
            if (err) return res.status(500).json({ error: '服务器内部错误' });
            if (!row) return res.json({ provider: 'deepseek', is_enabled: 0 });
            const { api_key, ...safe } = row;
            res.json({ ...safe, api_key: api_key ? '••••••••' : '' });
        });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.updateAiConfig = async (req, res) => {
    try {
        const { api_key, base_url, model, is_enabled } = req.body;
        db.run(`INSERT INTO ai_configs (id, provider, api_key, base_url, model, is_enabled)
          VALUES (1, 'deepseek', ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            api_key = COALESCE(?, api_key),
            base_url = COALESCE(?, base_url),
            model = COALESCE(?, model),
            is_enabled = COALESCE(?, is_enabled)`,
            [api_key || '', base_url || null, model || 'deepseek-chat',
             is_enabled !== undefined ? (is_enabled ? 1 : 0) : 0,
             api_key || null, base_url || null, model || null,
             is_enabled !== undefined ? (is_enabled ? 1 : 0) : null],
            function (err) { err ? res.status(500).json({ error: '服务器内部错误' }) : res.json({ message: 'AI 配置已更新' }); });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};
