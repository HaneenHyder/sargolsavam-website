const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for CSV

router.post('/upload', upload.single('file'), whatsappController.uploadSchedule);
router.post('/generate', whatsappController.generateMessages);
router.get('/messages', whatsappController.getMessages);
router.post('/messages/:id/send', whatsappController.markAsSent); // Changed to POST for action

module.exports = router;
