const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/tasksdb";

// Schema and model
const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String
});
const Task = mongoose.model('Task', taskSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedTasks();
  })
  .catch(err => console.log(err));

// Async function to ensure all default tasks exist
async function seedTasks() {
  const defaultTasks = [
    { id: 1, name: 'Task 1', status: 'pending' },
    { id: 2, name: 'Task 2', status: 'in-progress' },
    { id: 3, name: 'Task 3', status: 'done' },
    { id: 4, name: 'Task 4', status: 'pending' },
    { id: 5, name: 'Task 5', status: 'done' },
    { id: 6, name: 'Task 6', status: 'in-progress' },
    { id: 7, name: 'Tea',    status: 'pending' }
  ];

  for (const t of defaultTasks) {
    await Task.updateOne({ id: t.id }, t, { upsert: true });
  }

  console.log("All default tasks ensured in DB");
}

// API endpoint
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
