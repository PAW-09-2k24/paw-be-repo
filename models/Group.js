const mongoose = require('mongoose');
const Task = require('./Task');
const User = require('./User');

const groupSchema = new mongoose.Schema({
    taskID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task',
        required: true,
        default:[]
    }],
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },

});

module.exports = mongoose.model('group', groupSchema);