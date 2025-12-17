const express = require('express');
const router = express.Router();
const appealController = require('../controllers/appealController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/', verifyToken, appealController.createAppeal);
router.get('/my-appeals', verifyToken, appealController.getMyAppeals);
router.get('/', verifyToken, (req, res, next) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Require Admin Role' });
    }
    next();
}, appealController.getAllAppeals);

router.put('/:id/status', verifyToken, (req, res, next) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Require Admin Role' });
    }
    next();
}, appealController.updateAppealStatus);

module.exports = router;
