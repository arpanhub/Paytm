require('dotenv').config(); 
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

function authmiddleware(req, res, next) {
    // console.log("Entering authmiddleware");

    const authHeaders = req.headers.authorization;
    // console.log("Authorization header:", authHeaders);

    if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        // console.log("Invalid or missing authorization header");
        return res.status(401).json({
            message: "Authorization required"
        });
    }

    const token = authHeaders.split(' ')[1];
    // console.log("Extracted token:", token);

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log("Decoded token:", decoded);

        if (decoded.user) {
            req.userId = decoded.user;
            // console.log("Set req.userId:", req.userId);
            next();
        } else {
            // console.log("Missing userId in decoded token");
            return res.status(401).json({
                message: "Invalid token"
            });
        }
    } catch (err) {
        // console.error("Token verification error:", err);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authmiddleware;