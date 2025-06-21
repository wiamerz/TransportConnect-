const Historique = require("../Models/historique");


const addHistorique = async ({ utilisateurId, typeUtilisateur, action, annonceId, demandeId }) => {
  try {
    const historique = new Historique({
      utilisateurId,
      typeUtilisateur,
      action,
      annonceId: annonceId || null,
      demandeId: demandeId || null,
      dateAction: new Date()
    });
    await historique.save();
    return historique;
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'historique :", err);
    throw err;
  }
};

const getHistoriqueByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; 
    let historique;

    if (userRole === 'conducteur') {
      // Le conducteur voit seulement les actions liées à ses annonces
      historique = await Historique.find({
        utilisateurId: userId,
        typeUtilisateur: 'conducteur',
        annonceId: { $ne: null }
      })
      .populate('annonceId')
      .sort({ dateAction: -1 });

    } else if (userRole === 'expediteur') {
      // L’expéditeur voit seulement les actions liées à ses demandes
      historique = await Historique.find({
        utilisateurId: userId,
        typeUtilisateur: 'expediteur',
        demandeId: { $ne: null }
      })
      .populate('demandeId')
      .sort({ dateAction: -1 });

    } else {
      return res.status(403).json({ message: "Rôle utilisateur non autorisé" });
    }

    res.status(200).json(historique);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
  }
};

module.exports = {getHistoriqueByUser, addHistorique};
