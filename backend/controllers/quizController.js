const Question = require('../models/Question');
const QuizRecord = require('../models/QuizRecord');

exports.questions = async (req, res) => {
    try {
        const { category, limit } = req.query;
        const questions = await Question.randomByCategory(category, parseInt(limit) || 10);
        const sanitized = questions.map(q => ({
            id: q.id, category: q.category, passage: q.passage,
            question_text: q.question_text, options: q.options,
            difficulty: q.difficulty
        }));
        res.json(sanitized);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.submit = async (req, res) => {
    try {
        const { answers } = req.body;
        if (!answers || !Array.isArray(answers)) return res.status(400).json({ error: '参数不完整' });
        let score = 0;
        const results = [];
        for (const a of answers) {
            const q = await Question.findById(a.questionId);
            if (!q) continue;
            const correct = a.answer === q.answer;
            if (correct) score++;
            else if (req.user) await QuizRecord.addMistake(req.user.id, q.id, q.category);
            results.push({ questionId: q.id, correct, correctAnswer: q.answer, explanation: q.explanation });
        }
        if (req.user && answers.length > 0) {
            await QuizRecord.create(req.user.id, req.body.quizType || 'quick',
                req.body.category || '', score, answers.length, answers);
        }
        res.json({ score, total: answers.length, results });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.history = async (req, res) => {
    try {
        const records = await QuizRecord.findByUser(req.user.id);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.mistakes = async (req, res) => {
    try {
        const { category } = req.query;
        const mistakes = await QuizRecord.getMistakes(req.user.id, category);
        res.json(mistakes);
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};

exports.clearMistake = async (req, res) => {
    try {
        const { questionId } = req.body;
        await QuizRecord.clearMistake(req.user.id, questionId);
        res.json({ message: '已移除错题' });
    } catch (error) {
        res.status(500).json({ error: '服务器内部错误' });
    }
};
