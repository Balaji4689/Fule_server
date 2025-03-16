
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.WhatIsYourName;

if (!secretKey) {
    console.error("ERROR: WhatIsYourName is missing in .env file!");
    process.exit(1);
}

const verifyToken = async (req, res, next) => {
    console.log("Received Headers:", req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No Authorization Token Found!");
        return res.status(401).json({ error: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("Decoded Token:", decoded);

        if (!decoded.vendorId) {
            console.log("Token does not contain vendorId!");
            return res.status(400).json({ error: "Token does not contain vendorId!" });
        }

        req.vendorId = decoded.vendorId;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            console.error("Token Expired! Please Login Again.");
            return res.status(401).json({ error: "Token expired. Please login again." });
        } else {
            console.error("Token Verification Error:", error.message);
            return res.status(403).json({ error: "Invalid token" });
        }
    }
};

module.exports = verifyToken;
