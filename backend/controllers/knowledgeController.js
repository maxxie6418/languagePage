const Knowledge = require('../models/Knowledge');
const UserKnowledge = require('../models/UserKnowledge');
const Ebbinghaus = require('../models/Ebbinghaus');

exports.list = async (req, res) => {
    try {
        const { module, search } = req.query;
        const points = await Knowledge.findAll({ module, search });
        let userStatuses = {};
        if (req.user) {
            const uks = await UserKnowledge.findByUser(req.user.id);
            uks.forEach(uk => { userStatuses[uk.knowledge_id] = uk; });
        }
        const data = points.map(kp => ({
            ...kp, status: userStatuses[kp.id]?.status || 'unmastered',
            mastered_at: userStatuses[kp.id]?.mastered_at || null
        }));
        res.json(data);
    } catch (error) {
        console.error('获取知识点列表错误:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.detail = async (req, res) => {
    try {
        const kp = await Knowledge.findById(req.params.id);
        if (!kp) return res.status(404).json({ error: '知识点不存在' });
        res.json(kp);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { knowledgeId, status } = req.body;
        if (!knowledgeId || !status) return res.status(400).json({ error: '参数不完整' });
        if (!['unmastered', 'mastered'].includes(status))
            return res.status(400).json({ error: '无效的状态值' });
        const result = await UserKnowledge.upsertStatus(req.user.id, knowledgeId, status);
        if (status === 'mastered') {
            Ebbinghaus.generateRecords(req.user.id, 'knowledge', knowledgeId);
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.userKnowledge = async (req, res) => {
    try {
        const statuses = await UserKnowledge.findByUser(req.user.id);
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.stats = async (req, res) => {
    try {
        const stats = await UserKnowledge.getStats(req.user.id);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.modules = async (req, res) => {
    try {
        const modules = await Knowledge.getModules();
        res.json(modules);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};
