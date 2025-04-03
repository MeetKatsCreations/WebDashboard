const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../Controllers/ProfileController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;
