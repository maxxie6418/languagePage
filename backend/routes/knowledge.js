const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const authMiddleware = require('../middleware/auth');

router.get('/', knowledgeController.list);
router.get('/modules', knowledgeController.modules);
router.get('/:id', knowledgeController.detail);
router.post('/user/status', authMiddleware, knowledgeController.updateStatus);
router.get('/user/knowledge', authMiddleware, knowledgeController.userKnowledge);
router.get('/user/stats', authMiddleware, knowledgeController.stats);

module.exports = router;
