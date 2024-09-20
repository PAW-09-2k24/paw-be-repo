const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User');
const Group = require('../models/Group');

const createTask = asyncHandler(async (req, res) => {
    const { userID, groupID, title, deadline, description } = req.body;

    // Check if user exists
    try {
        const user = await User.findById(userID).lean().exec();
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error while checking user' });
    }

    // Check if group exists
    let group;
    try {
        group = await Group.findById(groupID).exec(); // Don't use .lean() here, as you'll need to modify the group document
        if (!group) {
            return res.status(400).json({ message: 'Group not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error while checking group' });
    }

    // Create task object
    const taskObj = {
        userID,
        groupID,
        title,
        deadline,
        description,
        completed: false
    };

    // Create task in the database
    try {
        const task = await Task.create(taskObj);
        if (task) {
            // Append task ID to group's tasks array
            group.taskID.push(task._id);

            // Save the updated group
            await group.save();

            return res.status(201).json({ message: 'Task created!', task });
        } else {
            return res.status(400).json({ message: 'Failed to create task!' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error while creating task' });
    }
});


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
        const taskGroups = await Group.find().lean()

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

module.exports = {createTask, getTaskAndTaskGroup, deleteTask, updateTask};