const express=require("express")
const router=express.Router();
const {registerUser}=require("../Controllers/AuthenticationController")
router.post("/register",registerUser)
module.exports=router;