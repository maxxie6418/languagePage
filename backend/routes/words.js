const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const authMiddleware = require('../middleware/auth');

router.get('/', wordController.list);
router.get('/categories', wordController.categories);
router.get('/:id', wordController.detail);
router.post('/user/status', authMiddleware, wordController.updateStatus);
router.post('/user/batch-status', authMiddleware, wordController.batchUpdateStatus);
router.get('/user/words', authMiddleware, wordController.userWords);
router.get('/user/stats', authMiddleware, wordController.stats);

module.exports = router;
