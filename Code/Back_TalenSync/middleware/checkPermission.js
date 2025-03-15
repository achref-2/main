// middleware/checkPermission.js

const Admin = require("../models/admin");

const checkPermission = (permission) => async (req, res, next) => {
    try {
        const admin = await Admin.findOne({ userId: req.user._id });

        if (!admin || !admin.permissions.includes(permission)) {
            return res.status(403).send({ message: "Access denied: insufficient permissions" });
        }

        next();
    } catch (error) {
        console.error("Error checking admin permissions:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = checkPermission;
