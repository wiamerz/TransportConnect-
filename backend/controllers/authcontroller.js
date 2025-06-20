const User = require('../Models/User'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs');

/////////////////// Register function ////////////////////////
const register = async (req, res) => {
  console.log('Requête d\'inscription reçue:', req.body);
  try {
    const { username, email, password, confirmPassword, number, role} = req.body;
    
    if (!username || !email || !password || !confirmPassword || !number || !role ) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Les mots de passe ne correspondent pas' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
   
    const user = new User({ 
      username, 
      email, 
      password, 
      number, 
      role
    });
    
    console.log('User object before saving:', {
      username: user.username,
      email: user.email,
      role: user.role,
      number: user.number
    });
    
    await user.save();
    console.log('User saved successfully with ID:', user._id);

    res.status(201).json({ 
      message: 'Utilisateur créé avec succès',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        number: user.number,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};

///////////////////// Login function ///////////////////////
const login = async (req, res) => {
  console.log(' Tentative de connexion pour:', req.body.email);
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }
    
    const user = await User.findOne({ email });
    // console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
    
    if (!user) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // console.log('Mot de passe valide:', isPasswordValid ? 'Oui' : 'Non');
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }
    
    // Check JWT secret
    // console.log('JWT_SECRET_KEY exists:', process.env.JWT_SECRET_KEY ? 'Oui' : 'Non');
    
    if (!process.env.JWT_SECRET_KEY) {
      // console.error('JWT_SECRET_KEY is not defined in environment variables!');
      return res.status(500).json({ message: 'Configuration serveur incorrecte' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' }
    );
    
    // console.log('Token généré:', token.substring(0, 20) + '...');
    
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};



///////////////////// Edit profile route //////////////////// 
const editProfile = async (req, res) => {
  try {
    const { username, email, number, userId } = req.body;
    
    if (!username || !email || !number) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'ID utilisateur requis' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Format d\'email invalide' });
    }
    

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre compte' });
      }
    }
    
    const updateData = {
      username,
      number,
      email
    };
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { 
        new: true,
        runValidators: true
      }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Erreur lors de la mise à jour' });
    }
    
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    
    res.status(200).json({
      message: 'Profil mis à jour avec succès',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Erreurs de validation', errors });
    }
    
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard' });
  }
};

module.exports = { register, login, editProfile};