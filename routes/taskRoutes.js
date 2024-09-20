const express = require('express')
const router = express.Router()
const {createTask,getTask,deleteTask,updateTask} = require('../controller/taskController')
router.route('/')
    .get(getTask)
    .post(createTask)
    .delete(deleteTask)
    .patch(updateTask)

module.exports = router;