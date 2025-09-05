// todoserver.js
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./todouser');      // User model
const authMiddleware = require('./todoauth'); // Auth middleware
const Todo = require('./todomodel');      // Todo model

const app = express();
const port = 4000;

// Use JSON parser
app.use(bodyParser.json());

// JWT secret (use .env in production)
const JWT_SECRET = "mysecretkey";

// ------------------- Authentication Routes -------------------

// Register
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Just pass plain password; pre-save hook will hash it
    const user = new User({ username, email, password });
    await user.save();

    res.json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // Generate JWT token (1 hour)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Protected route example
app.get('/profile', authMiddleware, async (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, this is your profile page.` });
});

// ------------------- Todo CRUD Routes -------------------

// Create Todo
app.post('/todo', authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = new Todo({ title, description, completed, userId: req.user.id });
    await todo.save();
    res.json({ message: "Todo created!", todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Todos for logged-in user
app.get('/todo', authMiddleware, async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id });
  res.json(todos);
});

// Get Todo by ID
app.get('/todo/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Update Todo
app.put('/todo/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { title, description, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo updated!", todo });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Delete Todo
app.delete('/todo/:id', authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted!" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


