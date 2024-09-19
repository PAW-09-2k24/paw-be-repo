const mongoose = require('mongoose');
const User = require('./User');

const taskSchema = new mongoose.Schema({
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
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['uncompleted', 'completed'],
        default: 'pending'
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
    
});

module.exports = mongoose.model('task', taskSchema);