const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.post('/chat', authMiddleware, aiController.chat);
router.post('/grammar', authMiddleware, aiController.grammar);
router.post('/word', authMiddleware, aiController.word);
router.post('/essay', authMiddleware, aiController.essay);

module.exports = router;
