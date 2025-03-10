const users = require("../Model/UserModel");
const axios=require("axios")
const registerUser = async (req, res) => {
    const { name, email, password, cpassword} = req.body;
    if (!name || !email || !password || !cpassword ) {
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
module.exports={registerUser}