const express = require('express')
const router = express.Router()
const {createTask,getTaskAndTaskGroup,deleteTask,updateTask} = require('../controller/taskController')
router.route('/')
    .get(getTaskAndTaskGroup)
    .post(createTask)
    .delete(deleteTask)
    .patch(updateTask)

module.exports = router;