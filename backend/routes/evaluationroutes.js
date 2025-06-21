const express = require('express');
const router = express.Router();
const {addEvaluationcond, addEvaluationexp} = require('../controllers/evaluationcontrollers')
const protect  = require('../middleware/authmiddle');

router.post('/addexp', protect, addEvaluationexp);
router.post('/addcond', protect, addEvaluationcond);


module.exports = router;
