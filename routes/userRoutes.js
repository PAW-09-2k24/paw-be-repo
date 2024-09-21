const express = require('express');
const router = express.Router();
const {registerUser, getAllUsers, login, logout} = require('../controller/userController');
const {getUserGroups, countUserGroups} = require('../controller/taskController');
const {verifyToken} = require('../middleware/jwtVerify');
router.route('/')
    .get(getAllUsers)
    .post(registerUser);

router.get('/groups',  verifyToken , getUserGroups);

router.get('/groupCount',  countUserGroups);

router.post('/login', login);

router.get('/logout', logout);




module.exports = router;