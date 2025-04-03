const express=require("express")
const router=express.Router();
const {registerUser,loginUser,validUser,googleLogin}=require("../Controllers/AuthenticationController")
const authenticate=require("../Middleware/Authenticate")
const passport=require("passport")
require("dotenv").config();
router.post("/register",registerUser)
router.post("/login",loginUser);
router.get("/validUser",authenticate,validUser);
router.get("/auth/google",googleLogin);


router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        if (!req.user || !req.user.token) {
            console.error("No token found after authentication.");
            return res.redirect("http://localhost:5173/login");
        }

        const token = req.user.token;
        console.log("Generated Token:", token);
        res.redirect(`http://localhost:5173/google-auth?token=${token}`);
    }
);

module.exports=router;