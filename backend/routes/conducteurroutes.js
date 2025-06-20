const express = require('express');
const router = express.Router();
const { createAnnonce, getAllAnnonces, getAnnonceById, getAnnoncesByDriver, updateAnnonce, deleteAnnonce} = require('../controllers/annoncecontroller');
const authMiddleware = require('../middleware/authmiddle');
const driverMiddleware = require('../middleware/drivermiddle');


router.post('/create', authMiddleware, driverMiddleware, createAnnonce);
router.get('/', getAllAnnonces);
router.get('/:id', getAnnonceById);
router.get('/driver/my-annonces', authMiddleware, driverMiddleware, getAnnoncesByDriver);
router.put('/:id', authMiddleware, driverMiddleware, updateAnnonce);
router.delete('/:id', authMiddleware, driverMiddleware, deleteAnnonce);

module.exports = router;