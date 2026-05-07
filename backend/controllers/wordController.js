const Word = require('../models/Word');
const UserWord = require('../models/UserWord');
const Ebbinghaus = require('../models/Ebbinghaus');

exports.list = async (req, res) => {
    try {
        const { search, category, page, limit } = req.query;
        const words = await Word.findAll({ search, category, page: parseInt(page) || 1, limit: parseInt(limit) || 100 });
        const total = await Word.count({ search, category });
        let userStatuses = {};
        if (req.user) {
            const uws = await UserWord.findByUser(req.user.id);
            uws.forEach(uw => { userStatuses[uw.word_id] = uw; });
        }
        const data = words.map(w => ({
            ...w, status: userStatuses[w.id]?.status || 'unmastered',
            mastered_at: userStatuses[w.id]?.mastered_at || null
        }));
        res.json({ words: data, total, page: parseInt(page) || 1 });
    } catch (error) {
        console.error('获取单词列表错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.detail = async (req, res) => {
    try {
        const word = await Word.findById(req.params.id);
        if (!word) return res.status(404).json({ error: '单词不存在' });
        res.json(word);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { wordId, status } = req.body;
        if (!wordId || !status) return res.status(400).json({ error: '参数不完整' });
        if (!['unmastered', 'learning', 'mastered'].includes(status))
            return res.status(400).json({ error: '无效的状态值' });
        const result = await UserWord.upsertStatus(req.user.id, wordId, status);
        if (status === 'mastered') {
            Ebbinghaus.generateRecords(req.user.id, 'word', wordId);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.batchUpdateStatus = async (req, res) => {
    try {
        const { wordIds, status } = req.body;
        if (!wordIds || !Array.isArray(wordIds) || wordIds.length === 0 || !status)
            return res.status(400).json({ error: '参数不完整' });
        if (!['unmastered', 'learning', 'mastered'].includes(status))
            return res.status(400).json({ error: '无效的状态值' });
        await UserWord.batchUpdateStatus(req.user.id, wordIds, status);
        if (status === 'mastered') {
            wordIds.forEach(id => Ebbinghaus.generateRecords(req.user.id, 'word', id));
        }
        res.json({ message: `已更新 ${wordIds.length} 个单词的状态` });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.userWords = async (req, res) => {
    try {
        const statuses = await UserWord.findByUser(req.user.id);
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.stats = async (req, res) => {
    try {
        const stats = await UserWord.getStats(req.user.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.categories = async (req, res) => {
    try {
        const categories = await Word.getCategories();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};
