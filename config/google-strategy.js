const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User'); // Import model User
const bcrypt = require('bcrypt');

// Konfigurasi Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cari user berdasarkan email dari profil Google
        let user = await User.findOne({ username: profile._json.email }).exec();

        // Jika user tidak ditemukan, buat user baru
        if (!user) {
          const lastSixDigitsID = profile.id.slice(-6);
          const lastTwoDigitsName = profile._json.name.slice(-2);
          const newPassword = lastTwoDigitsName + lastSixDigitsID;

          // Hash password baru
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(newPassword, salt);

          user = await User.create({
            username: profile._json.email.split('@')[0],
            password: hashedPassword,
            is_verified: true,
          });
        }

        // Lanjutkan proses login
        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, null);
      }
    }
  )
);

// Serialize dan deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;