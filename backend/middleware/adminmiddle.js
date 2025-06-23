
const adminMiddleware = async (req, res, next) => {
  
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  
};

module.exports = adminMiddleware;
