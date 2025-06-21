require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); 
const authRoutes = require('./routes/authroutes');
const annonceRoutes = require('./routes/conducteurRoutes');
const demandeRoutes = require('./routes/senderroutes');


const app = express();

// Middlewares
app.use(cors()); 
app.use(bodyParser.json());
app.use(express.json()); 


connectDB();

// Routes
app.use('/api/trans', authRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/demandes', demandeRoutes);

// testing
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server is running!' });
});

// 404 route
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({ 
        message: 'Erreur serveur interne',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});