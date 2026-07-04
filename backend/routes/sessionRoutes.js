const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getSessionInfo, endSession } = require('../controllers/sessionController');

const router = express.Router();

router.get('/', protect, getSessionInfo);
router.delete('/', protect, endSession);

module.exports = router;