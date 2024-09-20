const express = require('express');
const router = express.Router();
const {deleteGroup, createGroup, updateGroup} = require('../controller/groupController');

router.route('/')
    .post(createGroup)
    .patch(updateGroup)
    .delete(deleteGroup);
module.exports = router;
