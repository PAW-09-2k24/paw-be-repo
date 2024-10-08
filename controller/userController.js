const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const { json } = require('express');
const jwt = require('jsonwebtoken');


// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // confirm data
    if (!username || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // check if user exists
    const duplicateUser = await User.findOne({ username }).lean().exec();

    if (duplicateUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userObj = {
        username,
        password: hashedPassword
    }

    // create and store user
    const user = await User.create(userObj);

    if (user) {
        return res.status(201).json({ message: 'User created successfully' });
    } else {
        res.status(400), json({ message: 'Invalid user data received' });
    }

});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password -__v').lean().exec();
    if (users) {
        return res.status(200).json(users);
    } else {
        return res.status(404).json({ message: 'No users found' });
    }
});

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ username }).lean().exec();

    // if(!user){
    //     return res.status(404).json({message: 'User not found'});
    // }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        const payload = {
            id: user._id,
            username: user.username
        }
        const expiresIn = 60 * 60 * 1;
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: expiresIn });
        res.cookie('token', token, { httpOnly: true, maxAge: expiresIn * 1000, secure: true, sameSite: 'none' , path: '/'});
        return res.status(200).json({
            data: {
                id: user._id,
                username: user.username,
            },
            token: token,
            message: 'Login successful'
        });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

const logout = asyncHandler(async (req, res) => { });



module.exports = { registerUser, getAllUsers, login, logout };