const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Public route - get full schedule
router.get('/', scheduleController.getSchedule);

// Public route - get events for a specific day
router.get('/day/:dayId', scheduleController.getDayEvents);

// Admin routes - require authentication
router.post('/events', verifyToken, isAdmin, scheduleController.addEvent);
router.put('/events/:id', verifyToken, isAdmin, scheduleController.updateEvent);
router.delete('/events/:id', verifyToken, isAdmin, scheduleController.deleteEvent);

module.exports = router;
