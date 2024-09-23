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

const getUserGroups = async (req, res) => {
    const { userID } = req.query;

    // Validate input
    if (!userID) {
        return res.status(400).json({ message: 'User ID required' });
    }

    try {
        // find user by ID
        const user = await User.findById(userID).select("-password -__v").lean().exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // find all groups with user id
        const groups = await Group.find({
            userID: user._id
        }).select("-__v -userID").lean().exec();

        // find tasks with group id
        const groupsWithTasks = await Promise.all(
            groups.map(async (group) => {
                const tasks = await Task.find({
                    _id: { $in: group.taskID }
                }).select("-__v -userID").lean().exec();

                // append tasks to group
                return {
                    ...group,
                    tasks
                };
            })
        );

        // append group to user
        // const userWithGroups = {
        //     ...user,
        //     groupsWithTasks
        // };

        res.status(200).json({ data: groupsWithTasks, message: 'Success get group&task' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const countUserGroups = async (req, res) => {
    const { userID } = req.query;

    // Validate input
    if (!userID) {
        return res.status(400).json({ message: 'User ID required' });
    }

    try {
        // find user by ID
        const user = await User.findById(userID).lean().exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // find all groups with user id
        const groups = await Group.find({
            userID: user._id
        }).lean().exec();

        let taskCount = 0;
        let completedCount = 0;
        let uncompletedCount = 0;

        // find and count tasks for each group
        await Promise.all(
            groups.map(async (group) => {
                const tasks = await Task.find({
                    _id: { $in: group.taskID }
                }).lean().exec();

                taskCount += tasks.length;
                completedCount += tasks.filter(task => task.status === 'completed').length;
                uncompletedCount += tasks.filter(task => task.status === 'uncompleted').length;
            })
        );

        // Prepare the response object
        const response = {
            groupCount: groups.length,
            taskCount,
            completedCount,
            uncompletedCount
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getGroup = async (req, res) => {
    const { groupID } = req.query;

    // Validate input
    if (!groupID) {
        return res.status(400).json({ message: 'Group ID required' });
    }

    try {
        // find group by ID
        const group = await Group.findById(groupID).lean().exec();

        // if not found
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // get all task from group.taskID
        const tasks = await Task.find({
            _id: { $in: group.taskID }
        }).lean().exec();

        //separate taskID from group
        const { taskID, ...groupWithoutTaskID } = group;
        //append task to group
        const groupWithTasks = {
            ...groupWithoutTaskID,
            tasks
        };

        res.json({ group: groupWithTasks });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const getTask = async (req, res) => {
    const { taskID } = req.query;

    //validate input
    if (!taskID) {
        return res.status(400).json({ message: 'Task ID required' });
    }

    try {
        // find task by ID
        const task = await Task.findById(taskID).lean().exec();

        // if task not found
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
    const { taskID, title, deadline, status, description } = req.body

    try {
        // Confirm data
        if (!taskID) {
            return res.status(400).json({ message: 'Task ID are required' })
        }

        // Confirm note exists to update
        // const task = await Task.findById(taskID).exec()
        if (['uncompleted', 'completed'].includes(status)) {
            try {
                const taskUpdated = await Task.findByIdAndUpdate(taskID, { title, deadline, status, description }, { new: true });
                return res.status(200).json({data:taskUpdated,message:`'${taskUpdated.title}' updated`})
            } catch (error) {
                return res.status(500).json({ message: `Error updating status error:${error}` })
            }
        }
        return res.status(400).json({ message: 'Invalid status' })
        // task.taskID = taskID
        // task.title = title
        // task.deadline = deadline
        // task.status = status
        // task.description = description

        // const updatedTask = await task.save()

        // res.json(`'${updatedTask.title}' updated`)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }

})

module.exports = { createTask, getUserGroups, getTask, getGroup, deleteTask, updateTask, countUserGroups };