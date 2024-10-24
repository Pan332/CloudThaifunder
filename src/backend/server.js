import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// In-memory user data (replace with a database in a real app)
let users = [];
let items = [];

// Secret key for JWT (in a real app, store this securely in environment variables)
const JWT_SECRET = 'your_jwt_secret';

// Middleware to authenticate using JWT token
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

// Register User
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = users.find(user => user.username === username);
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
});

// Login User
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

// Get User Profile (Protected Route)
app.get('/api/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ username: user.username });
});

// Update User Profile (Protected Route)
app.put('/api/profile', authenticateToken, async (req, res) => {
    const { password } = req.body;
    const user = users.find(u => u.username === req.user.username);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (password) {
        user.password = await bcrypt.hash(password, 10);
        res.json({ message: 'Profile updated successfully' });
    } else {
        res.status(400).json({ error: 'No data to update' });
    }
});

// Delete User Profile (Protected Route)
app.delete('/api/profile', authenticateToken, (req, res) => {
    users = users.filter(user => user.username !== req.user.username);
    res.json({ message: 'User deleted successfully' });
});

// CRUD Operations for Items

// Create an Item (Protected Route)
app.post('/api/items', authenticateToken, (req, res) => {
    const { name, description } = req.body;
    const item = { id: items.length + 1, name, description, createdBy: req.user.username };
    items.push(item);
    res.status(201).json({ message: 'Item created successfully', item });
});

// Get all Items (Public)
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Update an Item (Protected Route)
app.put('/api/items/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const item = items.find(i => i.id === parseInt(id));

    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.createdBy !== req.user.username) return res.status(403).json({ error: 'Unauthorized' });

    item.name = name || item.name;
    item.description = description || item.description;
    res.json({ message: 'Item updated successfully', item });
});

// Delete an Item (Protected Route)
app.delete('/api/items/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const item = items.find(i => i.id === parseInt(id));

    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (item.createdBy !== req.user.username) return res.status(403).json({ error: 'Unauthorized' });

    items = items.filter(i => i.id !== parseInt(id));
    res.json({ message: 'Item deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
