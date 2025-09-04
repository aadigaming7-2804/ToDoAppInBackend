// server.js
const express = require('express');
const bodyParser = require('body-parser');
const Todo = require('./todoModel'); // import Todo model

const app = express();
const port = 4000;

app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
  res.send("<h1>Welcome to My Todo API</h1><h3>CRUD operations for Todo tasks</h3>");
});
// Create a new Todo
app.post('/todo', async (req, res) => {
  console.log(req.body);
  try {
    const { title, description, completed } = req.body;
    const todo = new Todo({ title, description, completed });
    await todo.save();
    res.json({ message: "Todo created!", todo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get all Todos
app.get('/todo', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});
// Get a Todo by ID
app.get('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});
// Update all Todos
app.put('/todo', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const result = await Todo.updateMany({}, { title, description, completed });
    res.json({ message: "All Todos updated!", result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a Todo by ID
app.put('/todo/:id', async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed },
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo updated!", todo });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});
// Delete a Todo by ID
app.delete('/todo/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo deleted!" });
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});
// Delete all Todos
app.delete('/todo', async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.json({ message: "All Todos deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});