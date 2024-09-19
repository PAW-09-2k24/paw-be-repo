const express = require('express');
const router = express.Router();
const {updateGroup, updateTask} = require('../controller/patchController');

router.patch('/group', updateGroup);
router.patch('/task', updateTask);

module.exports = router;