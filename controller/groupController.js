const Group = require('../models/Group');
const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const createGroup = asyncHandler(async (req, res) => {
    try {
        const {userID} = req.query;
        const { title } = req.body;
    
        const groupObj = {
            userID,
            title,
        };
    
        const group = await Group.create(groupObj);
    
        if (group) {
            return res.status(201).json({ message: 'Group created!', group });
        } else {
            return res.status(400).json({ message: 'Failed to create group!' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
});

const deleteGroup = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();

        const { groupID } = req.query;

        // Find the group and ensure it's found
        const group = await Group.findById(groupID).session(session);
        if (!group) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Group not found' });
        }

        // Log the task IDs to be deleted
        console.log("Tasks to delete: ", group.taskID);

        // Check if the group has associated tasks
        if (group.taskID && group.taskID.length > 0) {
            // Delete all tasks associated with the group
            const taskDeletionResult = await Task.deleteMany({ _id: { $in: group.taskID } }).session(session);

            // Log the task deletion result
            console.log("Tasks deleted: ", taskDeletionResult.deletedCount);
        } else {
            console.log("No tasks associated with the group.");
        }

        // Now, delete the group
        await Group.findByIdAndDelete(groupID).session(session);

        await session.commitTransaction();
        res.status(200).json({ message: 'Group and associated tasks deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Error deleting group', error: error.message });
    } finally {
        session.endSession();
    }
};



const updateGroup = asyncHandler(async (req, res) => {
    const { groupID } = req.query
    const { title } = req.body

    try {
        if (!groupID) {
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

        res.status(200).json(`Group updated`)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })

    }
})

module.exports = { deleteGroup, createGroup, updateGroup };