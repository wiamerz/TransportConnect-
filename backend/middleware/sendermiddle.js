const senderMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }
        
        if (req.user.role !== 'expediteur' && req.user.role !== 'sender') {
            return res.status(403).json({ 
                message: 'Accès refusé. Permissions d\'expéditeur requises.' 
            });
        }
        
        next();
    } catch (error) {
        console.error('Erreur dans le middleware expéditeur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = senderMiddleware;