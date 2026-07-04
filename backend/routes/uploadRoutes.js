const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;