const express = require('express');
const router = express.Router();
const { getDashboardData, getCandidateByChestNo, getAllCandidates } = require('../controllers/candidateController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', getAllCandidates);
router.get('/dashboard', verifyToken, getDashboardData);
router.get('/:chest_no', getCandidateByChestNo);

module.exports = router;
