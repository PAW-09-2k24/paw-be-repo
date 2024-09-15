const mongoose = require('mongoose');
const User = require('./User');

const toDoListSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    

});

module.exports = mongoose.model('toDoList', toDoListSchema);