const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const users = require("../Model/googleUser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback", 
            scope:["profile","email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await users.findOne({ googleId: profile.id });

                if (!user) {
                    user = new users({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id, 
                        image:profile.photos[0].value
                    });
                    await user.save();
                }

                const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1h" });

                return done(null, { user, token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;
