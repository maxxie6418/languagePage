const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const MAX_USERS = 50;

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        const userCount = await User.count();
        if (userCount >= MAX_USERS) {
            return res.status(400).json({ error: '注册用户数已达上限，请联系管理员' });
        }

        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: '用户名已存在' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        
        const role = userCount === 0 ? 'admin' : 'user';
        
        const user = await User.create(username, passwordHash, role);

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(201).json({
            message: '注册成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: '用户名和密码不能为空' });
        }

        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const passwordValid = await bcrypt.compare(password, user.password_hash);
        if (!passwordValid) {
            return res.status(401).json({ error: '用户名或密码错误' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            message: '登录成功',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                ebbinghausReminderEnabled: !!user.ebbinghaus_reminder_enabled
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.getMe = async (req, res) => {
    try {
        res.json({
            id: req.user.id,
            username: req.user.username,
            role: req.user.role,
            ebbinghausReminderEnabled: !!req.user.ebbinghaus_reminder_enabled
        });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};
