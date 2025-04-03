const users = require("../Model/UserModel");
const getUserProfile = async (req, res) => {
    try {
        const user = await users.findById(req.userId).select("-password -cpassword -tokens"); 
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};
module.exports={getUserProfile}