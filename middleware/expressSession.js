const session = require("express-session");
const passport = require("passport");

require("dotenv").config(); // Untuk mengakses variabel lingkungan

// Middleware untuk express-session dan Passport
const sessionMiddleware = (app) => {
  // Middleware express-session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your_secret_key", // Gunakan secret key dari .env
      resave: false, // Tidak menyimpan ulang sesi jika tidak ada perubahan
      saveUninitialized: true, // Simpan sesi kosong
      cookie: { secure: false }, // Set secure: true jika menggunakan HTTPS
    })
  );

  // Middleware Passport
  app.use(passport.initialize());
  app.use(passport.session());
};

module.exports = sessionMiddleware;
