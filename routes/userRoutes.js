const express = require('express');
const router = express.Router();
const {registerUser, getAllUsers, login, logout} = require('../controller/userController');

router.route('/')
    .get(getAllUsers)
    .post(registerUser);

router.post('/login', login);

router.get('/logout', logout);




module.exports = router;