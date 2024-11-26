const express = require('express');
const router = express.Router();
const {registerUser, getAllUsers, login, logout} = require('../controller/userController');
const {getUserGroups, countUserGroups} = require('../controller/taskController');
const {verifyToken} = require('../middleware/jwtVerify');
const passport = require ('passport')
router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );
  
  // Callback setelah autentikasi berhasil
  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Jika sukses, redirect ke halaman tertentu
      res.redirect("/dashboard");
    }
  );




module.exports = router;