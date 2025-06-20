const mongoose = require('mongoose');

const demandeSchema  = new mongoose.Schema({
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
     colis: {
    dimensions: {
      longueur: Number,
      largeur: Number,
      hauteur: Number,
    },
    poids: Number,
    type: {
      type: String,
      enum: ['Documents', 'Électronique', 'Vêtements', 'Alimentaire', 'Meubles', 'Autre'],
      required: true
    }
    },
    statut: {
    type: String,
    enum: ['en attente', 'acceptée', 'refusée', 'livrée'],
    default: 'en attente'
    },
    date: {
      type: Date ,
      required: [true, 'date is required'],
      trim: true
    },
     dateCreation: {
    type: Date,
    default: Date.now
  }
  });
  
  
  module.exports = mongoose.model('Demande', demandeSchema);  