const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Model User
const jwt = require("jsonwebtoken");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3500/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Ambil email dari profil Google
        const email = profile._json.email;

        // Cari user di database
        let user = await User.findOne({ username: email }).exec();

        if (!user) {
          // Jika user belum ada, buat user baru
          user = await User.create({
            username: email,
            password: "google-auth", // Password default
          });
          console.log("User baru berhasil dibuat:", user);
        } else {
          console.log("User sudah ada:", user);
        }

        // Generate JWT token
        const payload = {
          id: user._id,
          username: user.username,
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "1h", // Token berlaku selama 1 jam
        });

        // Tambahkan token ke objek user
        user.token = token;

        return done(null, user);
      } catch (error) {
        console.error("Error dalam GoogleStrategy:", error.message);
        return done(error, null);
      }
    }
  )
);

// Serialize user untuk session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user dari session
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
