const express = require('express');
const router = express.Router();
const { getHistoriqueByUser } = require('../controllers/historiquecontroller');
const protect  = require('../middleware/authmiddle');

router.get('/me', protect, getHistoriqueByUser);

module.exports = router;
