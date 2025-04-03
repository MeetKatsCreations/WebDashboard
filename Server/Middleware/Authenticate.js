const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(403).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = authenticate;
