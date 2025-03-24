const checkRole = (roles) => {
    return (req, res, next) => {
      console.log("User from token in checkRole:", req.user); // Debugging
      console.log("Expected roles:", roles);
      console.log("User role from token:", req.user.role);
  
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      if (!req.user.role) {
        console.log("Role not found in token!"); // Add this
        return res.status(403).json({ error: "Access denied. Role not found in token." });
      }
  
      if (!roles.includes(req.user.role)) {
        console.log(`Role ${req.user.role} not in allowed roles:`, roles); // Add this
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }
  
      next();
    };
  };
  
  module.exports = checkRole;
  