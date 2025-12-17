const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', resultsController.getResults);
router.post('/', verifyToken, isAdmin, resultsController.addResults);
router.post('/publish', verifyToken, isAdmin, resultsController.publishResults);
router.delete('/:id', verifyToken, isAdmin, resultsController.deleteResult);

module.exports = router;
