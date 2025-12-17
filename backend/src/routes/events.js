const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', verifyToken, isAdmin, eventController.createEvent);
router.put('/:id', verifyToken, isAdmin, eventController.updateEvent);
router.delete('/:id', verifyToken, isAdmin, eventController.deleteEvent);

module.exports = router;
