const express = require('express')
const router = express.Router()
const {createTask,getTask,deleteTask,updateTask, getAllTasks} = require('../controller/taskController')
const {verifyToken} = require('../middleware/jwtVerify');

router.route('/')
    .get(verifyToken,getTask)
    .post(verifyToken,createTask)
    .delete(verifyToken,deleteTask)
    .patch(verifyToken,updateTask);
router.get('/all',verifyToken,getAllTasks)
module.exports = router;