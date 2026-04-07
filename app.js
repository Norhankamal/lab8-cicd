// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/tasksdb";

app.use(express.json());

const taskSchema = new mongoose.Schema({
  id: Number,
  name: String,
  status: String
});
const Task = mongoose.model('Task', taskSchema);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedTasks();
  })
  .catch(err => console.log(err));

async function seedTasks() {
  await Task.deleteMany({});
  await Task.create({ id: 7, name: 'Tea', status: 'pending' });
  console.log("Tea task added");
}

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ id: 1 });
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const { name, status } = req.body;
  if (!name || !status) return res.status(400).json({ error: "Name and status required" });

  const lastTask = await Task.findOne().sort({ id: -1 });
  const newId = lastTask ? lastTask.id + 1 : 1;

  const newTask = new Task({ id: newId, name, status });
  await newTask.save();

  res.status(201).json(newTask);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findOne({ id: parseInt(req.params.id) });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

app.put('/tasks/:id', async (req, res) => {
  const { name, status } = req.body;
  const updated = await Task.findOneAndUpdate(
    { id: parseInt(req.params.id) },
    { name, status },
    { new: true }
  );
  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json(updated);
});

app.delete('/tasks/:id', async (req, res) => {
  const deleted = await Task.findOneAndDelete({ id: parseInt(req.params.id) });
  if (!deleted) return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Task deleted", task: deleted });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
