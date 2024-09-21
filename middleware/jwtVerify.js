const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Reusable function to verify token and user role
const verifyToken = async (req, res, next) => {
  const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).json({message: "Token Needed"});
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (typeof decoded !== "string") {
          req.userData = decoded;
        }
    } catch (error) {
        return res.status(401).json({message: "Invalid token"});
    }
    next();
};

// Middleware for protecting admin routes


module.exports = {
  verifyToken,
};
