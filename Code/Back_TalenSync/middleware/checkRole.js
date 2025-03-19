const checkRole = (roles) => {
    return (req, res, next) => {
        console.log("User from token in checkRole:", req.user); // Debugging
  
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
  
        if (!req.user.role) {
            return res.status(403).json({ error: "Access denied. Role not found in token." });
        }
  
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Access denied. Insufficient permissions." });
        }
  
        next();
    };
  };
  
  module.exports = checkRole;
  