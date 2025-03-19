const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded; // Attach user data to request
        console.log("Decoded token payload:", decoded);
        console.log("User role:", req.user.role);
        
        next(); // Proceed to next middleware
    } catch (error) {
        console.error("Token verification error:", error.message);
        res.status(401).json({ error: "Invalid token." });
    }
};
