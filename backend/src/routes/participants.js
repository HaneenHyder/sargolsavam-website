const express = require('express');
const router = express.Router();
const participantController = require('../controllers/participantController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/event/:eventId', participantController.getParticipantsByEvent);
router.post('/event/:eventId', verifyToken, isAdmin, participantController.addParticipant);
router.post('/event/:eventId/results', verifyToken, isAdmin, participantController.publishResults);
router.delete('/:id', verifyToken, isAdmin, participantController.removeParticipant);

module.exports = router;
