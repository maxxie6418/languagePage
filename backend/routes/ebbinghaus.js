const express = require('express');
const router = express.Router();
const ebbinghausController = require('../controllers/ebbinghausController');
const authMiddleware = require('../middleware/auth');

router.get('/today', authMiddleware, ebbinghausController.today);
router.get('/calendar', authMiddleware, ebbinghausController.calendar);
router.post('/review', authMiddleware, ebbinghausController.review);
router.get('/settings', authMiddleware, ebbinghausController.settings);
router.post('/settings', authMiddleware, ebbinghausController.settings);

module.exports = router;
