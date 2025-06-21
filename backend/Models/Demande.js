const mongoose = require('mongoose');

const demandeSchema = new mongoose.Schema({
  annonceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Annonce',
    required: true,
  },
  expediteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  colis: [{
    title: { type: String, required: true },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    weight: { type: Number, required: true },
    type: { type: String, required: [true, 'Le type de colis est requis'] }
  }],
  statut: {
    type: String,
    enum: ['en attente', 'acceptée', 'refusée', 'livrée'],
    default: 'en attente'
  },
  date: {
    type: Date,
    required: [true, 'date is required'],
  },
  dateCreation: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Demande', demandeSchema);