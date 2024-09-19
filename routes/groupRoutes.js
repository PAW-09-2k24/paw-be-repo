const express = require('express');
const router = express.Router();
const {deleteGroup} = require('../controller/groupController');

router.delete('/delete/:id', deleteGroup);

module.exports = router;
