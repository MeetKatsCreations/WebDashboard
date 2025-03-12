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


router.get("/auth/google/callback",
    passport.authenticate("google", { 
        
        failureRedirect: "/login",
        successRedirect:"/dashboard" }),
);
module.exports=router;