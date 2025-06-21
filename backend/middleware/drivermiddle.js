const driverMiddleware = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non authentifié' });
        }

        if (req.user.role !== 'conducteur' && req.user.role !== 'driver') {
            return res.status(403).json({ 
                message: 'Accès refusé. Permissions de conducteur requises.' 
            });
        }

        next();
    } catch (error) {
        console.error('Erreur dans le middleware conducteur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = driverMiddleware;