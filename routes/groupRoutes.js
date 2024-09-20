const express = require('express');
const router = express.Router();
const {deleteGroup, createGroup, updateGroup} = require('../controller/groupController');

router.route('/')
    .post(createGroup)
    .patch('/:id')
    .delete('/:id')
module.exports = router;
