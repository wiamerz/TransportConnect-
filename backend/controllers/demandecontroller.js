const Demande = require('../Models/Demande');
const Annonce = require('../Models/Annonce');

// Create demande 
const createDemande = async (req, res) => {
    try {
        const { annonceId, colis, date } = req.body;

        if (!annonceId || !colis || !date) {
            return res.status(400).json({ 
                error: 'annonceId, colis et date sont requis' 
            });
        }

        // Validate colis array
        if (!Array.isArray(colis) || colis.length === 0) {
            return res.status(400).json({ 
                error: 'Le colis doit être un tableau non vide' 
            });
        }

        // Validate each colis item
        for (let i = 0; i < colis.length; i++) {
            const colisItem = colis[i];
            if (!colisItem.type) {
                return res.status(400).json({ 
                    error: `Le type de colis est requis pour l'item ${i + 1}` 
                });
            }
            if (!colisItem.title) {
                return res.status(400).json({ 
                    error: `Le titre de colis est requis pour l'item ${i + 1}` 
                });
            }
            if (!colisItem.dimensions || !colisItem.dimensions.length || !colisItem.dimensions.width || !colisItem.dimensions.height) {
                return res.status(400).json({ 
                    error: `Les dimensions du colis sont requises pour l'item ${i + 1}` 
                });
            }
            if (!colisItem.weight) {
                return res.status(400).json({ 
                    error: `Le poids du colis est requis pour l'item ${i + 1}` 
                });
            }
        }

        if (!req.user || !req.user._id) {
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        const annonce = await Annonce.findById(annonceId);
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }

        if (annonce.conducteur.toString() === req.user._id.toString()) {
            return res.status(400).json({ 
                error: 'Vous ne pouvez pas faire une demande sur votre propre annonce' 
            });
        }

        // Check if user already has a pending demand for this annonce
        const existingDemande = await Demande.findOne({
            annonceId,
            expediteurId: req.user._id,
            statut: { $in: ['en attente', 'acceptée'] }
        });

        if (existingDemande) {
            return res.status(400).json({ 
                error: 'Vous avez déjà une demande en cours pour cette annonce' 
            });
        }

        const demande = await Demande.create({
            annonceId,
            expediteurId: req.user._id,
            colis,
            date: new Date(date),
            statut: 'en attente'
        });

        const populatedDemande = await Demande.findById(demande._id)
            .populate('annonceId', 'startPoint intermidiateSteps date')
            .populate('expediteurId', 'username email number');

        res.status(201).json({
            message: 'Demande créée avec succès',
            demande: populatedDemande
        });
    } catch (err) {
        console.error('Error creating demande:', err);
        res.status(500).json({ error: err.message });
    }
};


////////////// Get all demandes (for admin) ///////////////////////////
const getAllDemandes = async (req, res) => {
    try {
        const demandes = await Demande.find()
            .populate('annonceId', 'startPoint intermidiateSteps date conducteur')
            .populate('expediteurId', 'username email number')
            .populate({
                path: 'annonceId',
                populate: {
                    path: 'conducteur',
                    select: 'username email number'
                }
            })
            .sort({ dateCreation: -1 });
        
        res.status(200).json(demandes);
    } catch (err) {
        console.error('Error fetching demandes:', err);
        res.status(500).json({ error: err.message });
    }
};

/////////////////////// Get demandes by annonce ///////////////////////////
const getDemandesByAnnonce = async (req, res) => {
    try {
        const { annonceId } = req.params;

        const annonce = await Annonce.findById(annonceId);
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }

        if (annonce.conducteur.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                error: 'Non autorisé à voir les demandes de cette annonce' 
            });
        }

        const demandes = await Demande.find({ annonceId })
            .populate('expediteurId', 'username email number')
            .sort({ dateCreation: -1 });
        
        res.status(200).json(demandes);
    } catch (err) {
        console.error('Error fetching demandes by annonce:', err);
        res.status(500).json({ error: err.message });
    }
};

////////////////// Get sender demands ////////////////////////
const getShipperDemands = async (req, res) => {
    try {
        const demandes = await Demande.find({ expediteurId: req.user._id })
            .populate('annonceId', 'startPoint intermidiateSteps date')
            .populate({
                path: 'annonceId',
                populate: {
                    path: 'conducteur',
                    select: 'username email number'
                }
            })
            .sort({ dateCreation: -1 });
        
        res.status(200).json(demandes);
    } catch (err) {
        console.error('Error fetching shipper demands:', err);
        res.status(500).json({ error: err.message });
    }
};

////////////////////// Get driver demands (demandes received by driver) ///////////////////////
const getDriverDemands = async (req, res) => {
    try {
        const driverAnnonces = await Annonce.find({ conducteur: req.user._id });
        const annonceIds = driverAnnonces.map(annonce => annonce._id);

        // Get all demandes for these annonces
        const demandes = await Demande.find({ annonceId: { $in: annonceIds } })
            .populate('annonceId', 'startPoint intermidiateSteps date')
            .populate('expediteurId', 'username email number')
            .sort({ dateCreation: -1 });
        
        res.status(200).json(demandes);
    } catch (err) {
        console.error('Error fetching driver demands:', err);
        res.status(500).json({ error: err.message });
    }
};

//////////////////// Update demande status (accept/reject by driver)///////////////////////////
const updateDemandeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { statut } = req.body;

    
        if (!['acceptée', 'refusée', 'livrée'].includes(statut)) {
            return res.status(400).json({ 
                error: 'Statut invalide. Valeurs acceptées: acceptée, refusée, livrée' 
            });
        }

        const demande = await Demande.findById(id).populate('annonceId');
        if (!demande) {
            return res.status(404).json({ error: 'Demande non trouvée' });
        }

        // Check if user is the driver of the annonce
        if (demande.annonceId.conducteur.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                error: 'Non autorisé à modifier cette demande' 
            });
        }

        const updatedDemande = await Demande.findByIdAndUpdate(
            id,
            { statut },
            { new: true, runValidators: true }
        )
        .populate('annonceId', 'startPoint intermidiateSteps date')
        .populate('expediteurId', 'username email number');
        
        res.status(200).json({
            message: 'Statut de la demande mis à jour avec succès',
            demande: updatedDemande
        });
    } catch (err) {
        console.error('Error updating demande status:', err);
        res.status(500).json({ error: err.message });
    }
};

//////////////// Update demande  ////////////////////
const updateDemande = async (req, res) => {
    try {
        const { id } = req.params;
        const { colis, date } = req.body;

        const demande = await Demande.findById(id);
        if (!demande) {
            return res.status(404).json({ error: 'Demande non trouvée' });
        }

        // Check if user is the owner of the demande
        if (demande.expediteurId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                error: 'Non autorisé à modifier cette demande' 
            });
        }

        // Check if demande is still pending
        // if (demande.statut !== 'en attente') {
        //     return res.status(400).json({ 
        //         error: 'Impossible de modifier une demande qui n\'est plus en attente' 
        //     });
        // }

        const updateData = {};
        if (colis) updateData.colis = colis;
        if (date) updateData.date = new Date(date);

        const updatedDemande = await Demande.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('annonceId', 'startPoint intermidiateSteps date')
        .populate('expediteurId', 'username email number');
        
        res.status(200).json({
            message: 'Demande mise à jour avec succès',
            demande: updatedDemande
        });
    } catch (err) {
        console.error('Error updating demande:', err);
        res.status(500).json({ error: err.message });
    }
};

////////////////////// Delete demande /////////////////////////
const deleteDemande = async (req, res) => {
    try {
        const { id } = req.params;

        const demande = await Demande.findById(id);
        if (!demande) {
            return res.status(404).json({ error: 'Demande non trouvée' });
        }

        // Check if user is the owner of the demande
        if (demande.expediteurId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ 
                error: 'Non autorisé à supprimer cette demande' 
            });
        }

        // Check if demande is still pending
        // if (demande.statut !== 'en attente') {
        //     return res.status(400).json({ 
        //         error: 'Impossible de supprimer une demande qui n\'est plus en attente' 
        //     });
        // }

        await Demande.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'Demande supprimée avec succès' });
    } catch (err) {
        console.error('Error deleting demande:', err);
        res.status(500).json({ error: err.message });
    }
};

/////////////////////// Get demande by ID ///////////////////////////////
const getDemandeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const demande = await Demande.findById(id)
            .populate('annonceId', 'startPoint intermidiateSteps date')
            .populate('expediteurId', 'username email number')
            .populate({
                path: 'annonceId',
                populate: {
                    path: 'conducteur',
                    select: 'username email number'
                }
            });

        if (!demande) {
            return res.status(404).json({ error: 'Demande non trouvée' });
        }

        // Check if user has permission to view this demande
        const isShipper = demande.expediteurId._id.toString() === req.user._id.toString();
        const isDriver = demande.annonceId.conducteur._id.toString() === req.user._id.toString();

        if (!isShipper && !isDriver && req.user.role !== 'admin') {
            return res.status(403).json({ 
                error: 'Non autorisé à voir cette demande' 
            });
        }

        res.status(200).json(demande);
    } catch (err) {
        console.error('Error fetching demande:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {  createDemande,  getAllDemandes,  getDemandesByAnnonce,  getShipperDemands,  getDriverDemands,   updateDemandeStatus,  updateDemande, deleteDemande, getDemandeById };