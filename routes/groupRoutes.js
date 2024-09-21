const express = require('express');
const router = express.Router();
const {deleteGroup, createGroup, updateGroup} = require('../controller/groupController');
const {getGroup} = require('../controller/taskController')
const {verifyToken} = require('../middleware/jwtVerify');

router.route('/')
    .get(verifyToken,getGroup)
    .post(verifyToken,createGroup)
    .patch(verifyToken,updateGroup)
    .delete(verifyToken, deleteGroup);
module.exports = router;
