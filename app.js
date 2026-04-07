// app.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// استخدم متغير البيئة لو موجود، وإلا نستخدم هذا URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/tasksdb";

// Middleware لتحويل JSON
app.use(express.json());

// Schema و Model
const taskSchema = new mongoose.Schema({
  id: Number,      // ID متسلسل
  name: String,
  status: String
});
const Task = mongoose.model('Task', taskSchema);

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedTasks(); // Seed default tasks
  })
  .catch(err => console.log(err));

// Seed default tasks
async function seedTasks() {
  const defaultTasks = [
    { id: 1, name: 'Task 1', status: 'pending' },
    { id: 2, name: 'Task 2', status: 'in-progress' },
    { id: 3, name: 'Task 3', status: 'done' },
    { id: 4, name: 'Task 4', status: 'pending' },
    { id: 5, name: 'Task 5', status: 'done' },
    { id: 6, name: 'Task 6', status: 'in-progress' },
    { id: 7, name: 'Tea', status: 'pending' }
  ];

  for (const t of defaultTasks) {
    // upsert: true -> لو موجود يحدثه، لو مش موجود يضيفه
    await Task.updateOne({ id: t.id }, t, { upsert: true });
  }

  console.log("All default tasks ensured in DB");
}

// GET all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find().sort({ id: 1 }); // ترتيب حسب ID
  res.json(tasks);
});

// POST: إضافة مهمة جديدة مع ID ديناميكي
app.post('/tasks', async (req, res) => {
  const { name, status } = req.body;
  if (!name || !status) return res.status(400).json({ error: "Name and status required" });

  // احسب ID جديد = أعلى ID موجود + 1
  const lastTask = await Task.findOne().sort({ id: -1 });
  const newId = lastTask ? lastTask.id + 1 : 1;

  const newTask = new Task({ id: newId, name, status });
  await newTask.save();

  res.status(201).json(newTask);
});

// GET task by ID
app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findOne({ id: parseInt(req.params.id) });
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// PUT: تحديث حالة مهمة
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

// DELETE task
app.delete('/tasks/:id', async (req, res) => {
  const deleted = await Task.findOneAndDelete({ id: parseInt(req.params.id) });
  if (!deleted) return res.status(404).json({ error: "Task not found" });
  res.json({ message: "Task deleted", task: deleted });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
