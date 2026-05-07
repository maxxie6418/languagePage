const express = require('express');
const router = express.Router();
const progressService = require('../services/progress');

// 获取用户学习进度
router.get('/progress', (req, res) => {
  const progress = progressService.getProgress();
  res.json(progress);
});

// 获取错题本
router.get('/wrong-questions', (req, res) => {
  const wrongQuestions = progressService.getWrongQuestions();
  res.json({ questions: wrongQuestions });
});

// 获取学习统计
router.get('/stats', (req, res) => {
  const stats = progressService.getStats();
  res.json(stats);
});

// 重置进度（开发用）
router.post('/reset', (req, res) => {
  progressService.reset();
  res.json({ message: '进度已重置' });
});

module.exports = router;
