const Ebbinghaus = require('../models/Ebbinghaus');

exports.today = async (req, res) => {
    try {
        const reviews = await Ebbinghaus.getTodayReviews(req.user.id);
        res.json(reviews);
    } catch (error) {
        console.error('获取今日复习错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.calendar = async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30;
        const calendar = await Ebbinghaus.getCalendar(req.user.id, days);
        res.json(calendar);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.review = async (req, res) => {
    try {
        const { itemType, itemId, stage, mastered } = req.body;
        if (!itemType || !itemId || stage === undefined || mastered === undefined)
            return res.status(400).json({ error: '参数不完整' });
        await Ebbinghaus.reviewItem(req.user.id, itemType, itemId, stage, mastered);
        res.json({ message: mastered ? '复习完成' : '已标记为未掌握，复习计划已重置' });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.settings = async (req, res) => {
    try {
        if (req.method === 'GET') {
            const User = require('../models/User');
            const user = await User.findById(req.user.id);
            res.json({ ebbinghaus_reminder_enabled: !!user.ebbinghaus_reminder_enabled });
        } else {
            const { enabled } = req.body;
            const User = require('../models/User');
            await User.updateReminderSetting(req.user.id, enabled);
            res.json({ message: '设置已更新' });
        }
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};
