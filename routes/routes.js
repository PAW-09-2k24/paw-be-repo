const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(controller.getTaskAndTaskGroup)
    .delete(controller.deleteTask)

module.exports = router