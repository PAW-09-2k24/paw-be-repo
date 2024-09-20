const Group = require('../models/Group');
const Task = require('../models/Task');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const createGroup = asyncHandler(async (req, res) => {
  const {userID, title} = req.body;

  const groupObj = {
      userID,
      title,
      completed: false
  };

  const group = await Group.create(groupObj);

  if (group) {
      return res.status(201).json({ message: 'Group created!', group});
  } else {
      return res.status(400).json({ message: 'Failed to create group!'})
  }
});

const deleteGroup = async (req, res) => {
  let session;
    try {
        session = await mongoose.startSession();
        session.startTransaction();
        const groupId = req.params.id;
    
        // Temukan group
        const group = await Group.findOneAndDelete({groupId});
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
    
        // Hapus semua task yang terkait dengan group
        await Task.deleteMany({ _id: { $in: group.tasks } });
    
        // Hapus group
        await Group.findByIdAndDelete(groupId);
        
        await session.commitTransaction();
        res.status(200).json({ message: 'Group and associated tasks deleted successfully' });
      } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Error deleting group', error: error.message });
      }
  };

  const updateGroup = asyncHandler(async (req, res) => {
    const { groupID, title } = req.body

    // Confirm data
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

    res.json(`'${updatedGroup.title}' updated`)
})

  module.exports = {deleteGroup, createGroup, updateGroup};