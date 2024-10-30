const express = require('express');
const Todo = require('../models/Todo');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware to authenticate the use

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Storing the decoded user information for use in the route
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


// Create a new Todo
router.post('/', verifyToken, async (req, res) => {
    try {
        const user=req.user
        // console.log(user,'todo created');
        
        const todo = await Todo.create({user:user.id, title: req.body.title });
        res.status(201).json(todo);
        console.log(todo,'todo created');
    } catch (error) {
        res.status(400).json({ message: 'Error creating todo', error: error.message });
    }
});

// Get all Todos for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const userId=req.user.id
        const todos = await Todo.find({ user:userId });
        res.json(todos);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching todos', error: error.message });
    }
});

// Update a Todo
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json(todo);
    } catch (error) {
        res.status(400).json({ message: 'Error updating todo', error: error.message });
    }
});

// Delete a Todo
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) return res.status(404).json({ message: 'Todo not found' });
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting todo', error: error.message });
    }
});

module.exports = router;
