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

const getGroup = async (req, res) => {
    const { groupID } = req.query;

    // Validasi input
    if (!groupID) {
        return res.status(400).json({ message: 'Group ID required' });
    }

    try {
        // Cari group berdasarkan ID
        const group = await Group.findById(groupID).lean().exec();

        // Jika group tidak ditemukan
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Ambil semua task berdasarkan ID dari array taskID yang ada di group
        const tasks = await Task.find({
            _id: { $in: group.taskID }
        }).lean().exec();

        // Ganti array taskID dengan array informasi detail dari task
        const { taskID, ...groupWithoutTaskID } = group;
        const groupWithTasks = {
            ...groupWithoutTaskID,
            tasks
        };

        res.json({ group: groupWithTasks });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getTask = async(req, res) => {
    const {taskID} = req.query;

    if(!taskID){
        return res.status(400).json({message: 'Task ID required'});
    }

    try {
        // Cari task berdasarkan ID
        const task = await Task.findById(taskID).lean().exec();

        // Jika task tidak ditemukan
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ task });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
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

module.exports = {createTask, getTask, getGroup, deleteTask, updateTask};