const express = require('express');
const router = express.Router();
const {deleteGroup, createGroup, updateGroup} = require('../controller/groupController');
const {getGroup} = require('../controller/taskController')

router.route('/')
    .get(getGroup)
    .post(createGroup)
    .patch(updateGroup)
    .delete(deleteGroup);
module.exports = router;
