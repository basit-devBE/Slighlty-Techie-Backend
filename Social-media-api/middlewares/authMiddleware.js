const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

const requireSign = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // Correct header key
        if (!authHeader) {
            return res.status(401).json({ error: "You are not authorized to access this route" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "You are not authorized to access this route" });
        }
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        if (!decodedToken) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        
        const userId = decodedToken.id; // Use correct field from token
        const user = await User.findById(userId); // Use findById for user lookup
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.auth = user;
        next(); // Call next() to pass control to the next middleware
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = requireSign;
