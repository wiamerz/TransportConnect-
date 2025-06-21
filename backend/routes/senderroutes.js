const express = require('express');
const router = express.Router();
const { 
    createDemande,
    getAllDemandes,
    getDemandesByAnnonce,
    getShipperDemands,
    getDriverDemands,
    updateDemandeStatus,
    updateDemande,
    deleteDemande,
    getDemandeById
} = require('../controllers/demandecontroller');
const authMiddleware = require('../middleware/authmiddle');
const driverMiddleware = require('../middleware/drivermiddle');
const adminMiddleware = require('../middleware/adminmiddle');

router.post('/create', authMiddleware, createDemande);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllDemandes);
router.get('/annonce/:annonceId', authMiddleware, driverMiddleware, getDemandesByAnnonce);
router.get('/shipper/my-demands', authMiddleware, getShipperDemands);
router.get('/driver/received-demands', authMiddleware, driverMiddleware, getDriverDemands);
router.put('/:id/status', authMiddleware, driverMiddleware, updateDemandeStatus);
router.get('/:id', authMiddleware, getDemandeById);
router.put('/:id', authMiddleware, updateDemande);
router.delete('/:id', authMiddleware, deleteDemande);

module.exports = router;