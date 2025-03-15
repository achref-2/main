const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;

        // Check if the user has admin role
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token." });
    }
};
