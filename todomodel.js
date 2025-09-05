// todoModel.js
const mongoose = require('./todomongo');

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link todo to user
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
