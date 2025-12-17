const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/signed-url', verifyToken, isAdmin, uploadController.getUploadUrl);
router.get('/:id/signed-url', verifyToken, uploadController.getDownloadUrl);

module.exports = router;
