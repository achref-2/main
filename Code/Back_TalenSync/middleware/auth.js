const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
    }
};

// Middleware to check if user has required role
const checkRole = (roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: "Access denied. Insufficient permissions." });
      }
      
      next();
    };
  };
  
  // Example usage:
  // app.get("/api/candidates", auth, checkRole(["admin", "recruiter"]), async (req, res) => { ... });
  // app.get("/api/my-profile", auth, checkRole(["candidate"]), async (req, res) => { ... });
  
  module.exports = checkRole;