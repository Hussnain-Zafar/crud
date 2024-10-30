const mongoose = require('mongoose');
// const User = require('../models/User')

const todoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
