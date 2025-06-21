const Evaluation = require('../Models/Evaluation');

//add evaluation as a expideteur

const addEvaluationexp = async (req, res) => {
  try {
    const { conducteurId, annonceId, note, comment, date } = req.body;

    if (!conducteurId || !annonceId || !note || !comment || !date) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: 'Tous les champs sont requis',
      });
    }

    if (!req.user || !req.user._id) {
      console.log('No user in request');
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const evaluation = await Evaluation.create({
      conducteurId,
      expediteurId: req.user._id, 
      annonceId,
      note,
      comment,
      date: new Date(date),
    });

    res.status(201).json({
      message: 'Évaluation créée avec succès',
      evaluation,
    });
  } catch (err) {
    console.error('Error creating evaluation:', err);
    res.status(500).json({ error: err.message });
  }
};

// add as an driver

const addEvaluationcond = async (req, res) => {
  try {
    const { expediteurId, annonceId, note, comment, date } = req.body;

    if (!expediteurId || !annonceId || !note || !comment || !date) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: 'Tous les champs sont requis',
      });
    }

    if (!req.user || !req.user._id) {
      console.log('No user in request');
      return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    const evaluation = await Evaluation.create({
      conducteurId: req.user._id,
      expediteurId, 
      annonceId,
      note,
      comment,
      date: new Date(date),
    });

    res.status(201).json({
      message: 'Évaluation créée avec succès',
      evaluation,
    });
  } catch (err) {
    console.error('Error creating evaluation:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {addEvaluationexp, addEvaluationcond}; 


