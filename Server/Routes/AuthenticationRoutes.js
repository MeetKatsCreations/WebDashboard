const express=require("express")
const router=express.Router();
const {registerUser,loginUser,validUser}=require("../Controllers/AuthenticationController")
const authenticate=require("../Middleware/Authenticate")
router.post("/register",registerUser)
router.post("/login",loginUser);
router.get("/validUser",authenticate,validUser);
module.exports=router;