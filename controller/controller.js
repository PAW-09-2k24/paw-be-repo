const Task = require('../models/Task') // Pastikan model Task sudah sesuai
const TaskGroup = require('../models/TaskGroup') // Jika TaskGroup juga ada
const User = require('../models/User')

// @desc Get Task and TaskGroup
// @route GET /task
// @access Private
const getTaskAndTaskGroup = async (req, res) => {
    try {
        // Get Task from MongoDB
        const tasks = await Task.find().lean()  

        // If no Task
        if (!tasks?.length) {
            return res.status(400).json({ message: 'No tasks found' })
        }

        // Add username to each task before sending the response
        const tasksWithUser = await Promise.all(tasks.map(async (task) => {
            const user = await User.findById(task.user).lean().exec()
            return { ...task, username: user.username }
        }))

        // Optionally, fetch TaskGroup if necessary
        const taskGroups = await TaskGroup.find().lean()

        // Combine tasks and task groups into the response
        res.json({ tasks: tasksWithUser, taskGroups })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

// @desc Delete a Task
// @route DELETE /task
// @access Private
const deleteTask = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Task ID required' })
    }

    try {
        // Confirm Task exists to delete
        const task = await Task.findById(id).exec()

        if (!task) {
            return res.status(400).json({ message: 'Task not found' })
        }

        const result = await task.deleteOne()

        const reply = `Task '${result.title}' with ID ${result._id} deleted`

        res.json({ message: reply })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

module.exports = {
    getTaskAndTaskGroup,
    deleteTask
}
