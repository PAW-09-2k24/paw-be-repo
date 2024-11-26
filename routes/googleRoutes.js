const express = require("express");
const passport = require("passport");
const router = express.Router();

// Endpoint untuk login dengan Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback setelah login berhasil
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      // Ambil token dari user yang berhasil login
      const token = req.user.token;

      // Set token di cookie
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000, // 1 jam
        secure: true, // Aktifkan jika menggunakan HTTPS
        sameSite: "none", // Untuk kompatibilitas lintas domain
        path: "/", // Berlaku untuk seluruh domain
      });

      // Redirect ke dashboard frontend
      res.redirect("http://localhost:3000/to-do");
    } catch (error) {
      console.error("Error dalam Google callback:", error.message);
      res.redirect("/login");
    }
  }
);

module.exports = router;
