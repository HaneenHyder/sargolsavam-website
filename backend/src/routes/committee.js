const express = require('express');
const router = express.Router();
const committeeController = require('../controllers/committeeController');

const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', committeeController.getAllCommitteeMembers);
router.put('/reorder', verifyToken, isAdmin, committeeController.reorderCommitteeMembers);
router.put('/:id', verifyToken, isAdmin, committeeController.updateCommitteeMember);

module.exports = router;
