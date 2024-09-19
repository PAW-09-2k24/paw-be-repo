const Task = require('../models/Task');
const Group = require('../models/Group');
const asyncHandler = require('express-async-handler')

const updateGroup = asyncHandler(async (req, res) => {
    const { groupID, title } = req.body

    // Confirm data
    if (!groupID || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Group ID are required' })
    }

    // Confirm note exists to update
    const group = await Group.findById(groupID).exec()

    if (!group) {
        return res.status(400).json({ message: 'Group not found' })
    }

    group.groupID = groupID
    group.title = title

    const updatedGroup = await group.save()

    res.json(`'${updatedGroup.title}' updated`)
})

const updateTask = asyncHandler(async (req, res) => {
    const { taskID, userID, title, deadline, status, description } = req.body

    // Confirm data
    if (!taskID || typeof completed !== 'boolean') {
        return res.status(400).json({ message: 'Task ID are required' })
    }

    // Confirm note exists to update
    const task = await Task.findById(taskID).exec()

    if (!task) {
        return res.status(400).json({ message: 'Task not found' })
    }

    task.taskID = taskID
    task.userID = userID
    task.title = title
    task.deadline = deadline
    task.status = status
    task.description = description

    const updatedTask = await task.save()

    res.json(`'${updatedTask.title}' updated`)
})

module.exports = {updateGroup, updateTask};