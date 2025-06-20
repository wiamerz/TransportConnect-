const mongoose = require('mongoose');

const annonceSchema  = new mongoose.Schema({
   conducteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Le conducteur is required'],
    },
    startPoint: {
      type: String,
      required: [true, "start point is required"],
      trim: true,
    },
    intermidiateSteps: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      required: [true, 'capacity is required'],
    },
    //  demandes: [
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Demande'
    // }
    //  ],
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
  
  
  module.exports = mongoose.model('Annonce', annonceSchema);  