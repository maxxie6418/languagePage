const express = require('express');
const router = express.Router();
const questionsData = require('../data/questions.json');
const progressService = require('../services/progress');

// 获取练习题列表
router.get('/questions', (req, res) => {
  const { type, topic, difficulty, count } = req.query;
  let questions = [...questionsData.questions];

  // 筛选条件
  if (type) {
    questions = questions.filter(q => q.type === type);
  }
  if (topic) {
    questions = questions.filter(q => q.topic === topic);
  }
  if (difficulty) {
    questions = questions.filter(q => q.difficulty === difficulty);
  }

  // 限制数量
  if (count) {
    questions = questions.slice(0, parseInt(count));
  }

  res.json({ questions, total: questions.length });
});

// 获取题目类型统计
router.get('/stats', (req, res) => {
  const stats = {};
  questionsData.questions.forEach(q => {
    if (!stats[q.type]) {
      stats[q.type] = { count: 0, topics: {} };
    }
    stats[q.type].count++;
    if (!stats[q.type].topics[q.topic]) {
      stats[q.type].topics[q.topic] = 0;
    }
    stats[q.type].topics[q.topic]++;
  });
  res.json(stats);
});

// 提交答案
router.post('/submit', (req, res) => {
  const { questionId, answer, timeSpent } = req.body;

  const question = questionsData.questions.find(q => q.id === questionId);
  if (!question) {
    return res.status(404).json({ error: '题目未找到' });
  }

  const isCorrect = answer === question.correctAnswer;

  // 更新用户进度
  progressService.recordAttempt(questionId, {
    answer,
    isCorrect,
    timeSpent,
    timestamp: new Date().toISOString()
  });

  res.json({
    correct: isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    knowledgePoint: question.knowledgePoint,
    relatedBasics: question.relatedBasics
  });
});

// 批量提交（模考用）
router.post('/submit-batch', (req, res) => {
  const { answers } = req.body; // [{ questionId, answer, timeSpent }]

  const results = answers.map(({ questionId, answer, timeSpent }) => {
    const question = questionsData.questions.find(q => q.id === questionId);
    if (!question) {
      return { questionId, error: '题目未找到' };
    }

    const isCorrect = answer === question.correctAnswer;
    progressService.recordAttempt(questionId, {
      answer,
      isCorrect,
      timeSpent,
      timestamp: new Date().toISOString()
    });

    return {
      questionId,
      correct: isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      knowledgePoint: question.knowledgePoint
    };
  });

  const score = results.filter(r => r.correct).length;
  const total = results.filter(r => !r.error).length;

  res.json({
    score,
    total,
    percentage: Math.round((score / total) * 100),
    results
  });
});

module.exports = router;
