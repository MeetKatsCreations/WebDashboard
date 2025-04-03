const users = require("../Model/UserModel");
const axios=require("axios")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const GoogleUser = require("../Model/googleUser");
const mongoose = require("mongoose");
const registerUser = async (req, res) => {
    const { name, email, password, cpassword, recaptchaToken } = req.body;
    if (!name || !email || !password || !cpassword|| !recaptchaToken ) {
        return res.status(400).json({ message: "Fill all the fields!" });
    }
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: recaptchaToken,
                },
            }
        );

        if (!response.data.success) {
            return res.status(400).json({ message: "reCAPTCHA validation failed!" });
        }
        const nameRegex = /^[a-zA-Z ]{2,40}$/;
        const preuser = await users.findOne({ email: email });
        if (preuser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        else if (password !== cpassword) {
            return res.status(400).json({ message: "password and confirmPassword does not matches!" })
        }
        else if (password.length < 8) {
            return res.status(400).json({ message: "password must be at least 8 characters long!" })

        } else if (!nameRegex.test(name)) {
            return res.status(400).json({ message: "Name must contain only alphabets and be between 2 and 40 characters long!" });
        } else {
            const finalUser = new users({ name, email, password, cpassword });
            const storeUser = await finalUser.save();
            res.status(201).json({ message: "User Successfully added" });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error while registering a user", error: error.message });
    }
}
const loginUser = async (req, res) => {

    const { email, password, recaptchaToken } = req.body;
    if (!email || !password || !recaptchaToken) {
        return res.status(400).json({ message: "Fill all the required fields!" });
    }
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET,
                    response: recaptchaToken,
                },
            }
        );
        console.log("reCAPTCHA response:", response.data);
        if (!response.data.success) {
            return res.status(400).json({ message: "reCAPTCHA validation failed!", details: response.data });
        }
        const preUser = await users.findOne({ email: email });
        if (!preUser) {
            return res.status(400).json({ message: "User does not exist!" });
        } else {
            const isMatch = await bcrypt.compare(password, preUser.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid details!" });
            } else {
                const token = await preUser.generateAuthToken();
                console.log("Generated Token:", token);
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                return res.status(201).json({
                    message: "User logged in successfully",
                    token,
                    user: preUser 
                });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error while logging in a user", error: error.message });
    }
};

const validUser = async (req, res) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        console.log("Token received:", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log("Decoded Token:", decoded);

       
        const user = await users.findById(new mongoose.Types.ObjectId(decoded._id));

        if (!user) {
            user = await GoogleUser.findById(decoded.id);
        }

        if (!user) {
            return res.status(404).json({ message: "User not found in DB" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Valid User Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
googleLogin = passport.authenticate("google", {
    scope: ["profile", "email"]
});

module.exports={registerUser,loginUser,validUser,googleLogin}
