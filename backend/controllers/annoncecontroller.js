const Annonce = require('../Models/Annonce'); 
const { addHistorique } = require('./historiquecontroller'); 


///////////////////// Create annonce ////////////////////////////////
const createAnnonce = async (req, res) => {
    try {
        console.log('Create annonce request received');
        console.log(' User from middleware:', req.user ? `${req.user.username} (${req.user.role})` : 'None');
        console.log(' Request body:', req.body);
        
        const { startPoint, intermidiateSteps, capacity, date } = req.body;
        
        // Validate required fields
        if (!startPoint || !capacity || !date) {
            console.log('Missing required fields');
            return res.status(400).json({ 
                error: 'Les champs startPoint, capacity et date sont requis' 
            });
        }

        // Validate user
        if (!req.user || !req.user._id) {
            console.log('No user in request');
            return res.status(401).json({ error: 'Utilisateur non authentifié' });
        }

        console.log('✅ Creating annonce for user ID:', req.user._id);

        // Create annonce
        const annonce = await Annonce.create({
            conducteur: req.user._id, 
            startPoint,
            intermidiateSteps: intermidiateSteps || [],
            capacity: parseInt(capacity), 
            date: new Date(date)
        });

        await addHistorique({
            utilisateurId: req.user._id,
            typeUtilisateur: 'conducteur',
            action: 'trajet_cree',
            annonceId: annonce._id
         });

        console.log('✅ Annonce created successfully:', annonce._id);

        res.status(201).json({
            message: 'Annonce créée avec succès',
            annonce: annonce
        });
    } catch (err) {
        console.error('❌ Error creating annonce:', err);
        res.status(500).json({ error: err.message });
    }
}

////////////////////// Get all annonces /////////////////////////
const getAllAnnonces = async (req, res) => {
    try {
        const annonces = await Annonce.find()
            .populate('conducteur', 'username email number')
            .sort({ dateCreation: -1 });
        
        res.status(200).json(annonces);
    } catch (err) {
        console.error('Error fetching annonces:', err);
        res.status(500).json({ error: err.message });
    }
}

////////////////// Get annonce by id /////////////////////////
const getAnnonceById = async (req, res) => {
    try {
        const { id } = req.params;
        const annonce = await Annonce.findById(id)
            .populate('conducteur', 'username email number');
        
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }
        
        res.status(200).json(annonce);
    } catch (err) {
        console.error('Error fetching annonce:', err);
        res.status(500).json({ error: err.message });
    }
}

////////////////////////// Get annonces by driver ///////////////////////
const getAnnoncesByDriver = async (req, res) => {
    try {
        const annonces = await Annonce.find({ conducteur: req.user._id })
            .populate('conducteur', 'username email number')
            .sort({ dateCreation: -1 });
        
        res.status(200).json(annonces);
    } catch (err) {
        console.error('Error fetching driver annonces:', err);
        res.status(500).json({ error: err.message });
    }
}

/////////////////////// Update annonce ///////////////////////////
const updateAnnonce = async (req, res) => {
    try {
        const { id } = req.params;
        const { startPoint, intermidiateSteps, capacity, date } = req.body;
        
        const existingAnnonce = await Annonce.findById(id);
        if (!existingAnnonce) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }
        
        if (existingAnnonce.conducteur.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Non autorisé à modifier cette annonce' });
        }
        
        const updatedAnnonce = await Annonce.findByIdAndUpdate(
            id,
            {
                startPoint,
                intermidiateSteps,
                capacity,
                date: date ? new Date(date) : existingAnnonce.date
            },
            { new: true, runValidators: true }
        ).populate('conducteur', 'username email number');
        
        res.status(200).json({
            message: 'Annonce mise à jour avec succès',
            annonce: updatedAnnonce
        });
    } catch (err) {
        console.error('Error updating annonce:', err);
        res.status(500).json({ error: err.message });
    }
}

///////////////////////// Delete annonce ////////////////////////
const deleteAnnonce = async (req, res) => {
    try {
        const { id } = req.params;
        
        const annonce = await Annonce.findById(id);
        if (!annonce) {
            return res.status(404).json({ error: 'Annonce non trouvée' });
        }
        
        if (annonce.conducteur.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Non autorisé à supprimer cette annonce' });
        }
        
        await Annonce.findByIdAndDelete(id);
        
        res.status(200).json({ message: 'Annonce supprimée avec succès' });
    } catch (err) {
        console.error('Error deleting annonce:', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { 
    createAnnonce, 
    getAllAnnonces, 
    getAnnonceById, 
    getAnnoncesByDriver, 
    updateAnnonce, 
    deleteAnnonce 
};