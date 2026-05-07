const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.get('/users', authMiddleware, adminController.getUsers);
router.post('/users/:id/reset-password', authMiddleware, adminController.resetPassword);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);
router.get('/ai-config', authMiddleware, adminController.getAiConfig);
router.post('/ai-config', authMiddleware, adminController.updateAiConfig);

module.exports = router;
