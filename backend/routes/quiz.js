const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const authMiddleware = require('../middleware/auth');

router.get('/questions', quizController.questions);
router.post('/submit', quizController.submit);
router.get('/history', authMiddleware, quizController.history);
router.get('/mistakes', authMiddleware, quizController.mistakes);
router.post('/mistakes/clear', authMiddleware, quizController.clearMistake);

module.exports = router;
