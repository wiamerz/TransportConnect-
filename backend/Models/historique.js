const mongoose = require('mongoose');

const historiqueSchema = new mongoose.Schema({
  utilisateurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  typeUtilisateur: {
    type: String,
    enum: ['conducteur', 'expediteur'],
    required: true
  },
  action: {
    type: String,
    enum: ['trajet_cree', 'demande_envoyee', 'trajet_accepte', 'livraison_terminee'],
    required: true
  },
  annonceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
  },
  demandeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Demande',
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Historique', historiqueSchema);
