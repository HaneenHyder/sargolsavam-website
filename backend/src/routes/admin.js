const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temporary storage for import

router.get('/stats', verifyToken, isAdmin, adminController.getDashboardStats);
router.get('/leaderboard', verifyToken, isAdmin, adminController.getLeaderboard);
router.get('/leaderboard/detailed', verifyToken, isAdmin, require('../controllers/leaderboardController').getDetailedLeaderboard);
router.get('/auditlogs', verifyToken, isAdmin, adminController.getAuditLogs);
router.get('/analytics', verifyToken, isAdmin, analyticsController.getStats);
router.get('/export/team/:code', verifyToken, isAdmin, adminController.exportTeam);
router.post('/import-candidates', verifyToken, isAdmin, upload.single('file'), adminController.importCandidates);
router.post('/create-admin', adminController.createAdmin); // Helper to create first admin

// Temporary Remote Seeding Endpoint
router.post('/seed-committee', verifyToken, isAdmin, async (req, res) => {
    try {
        const seedCommittee = require('../../../seed-committee');
        console.log('🌱 Triggering remote committee seed...');
        await seedCommittee();
        res.status(200).json({ message: 'Committee seeding triggered successfully.' });
    } catch (error) {
        console.error('❌ Remote seeding failed:', error);
        res.status(500).json({ error: 'Seeding failed', details: error.message });
    }
});

module.exports = router;
