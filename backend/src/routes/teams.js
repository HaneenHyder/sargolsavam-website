const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

const { verifyToken } = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, teamController.getDashboardData);
router.get('/', teamController.getAllTeams);
router.get('/:code', teamController.getTeamByCode);

module.exports = router;
