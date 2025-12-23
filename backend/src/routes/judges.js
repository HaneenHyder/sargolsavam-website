const router = require('express').Router();
const judgeController = require('../controllers/judgeController');

router.get('/', judgeController.getAllJudges);
router.get('/:id', judgeController.getJudgeById);

module.exports = router;
