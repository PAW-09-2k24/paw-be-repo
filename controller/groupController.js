const Group = require('../models/Group');
const Task = require('../models/Task');

const deleteGroup = async (req, res) => {
    try {
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
    
        res.status(200).json({ message: 'Group and associated tasks deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting group', error: error.message });
      }
  };

  module.exports = {deleteGroup};