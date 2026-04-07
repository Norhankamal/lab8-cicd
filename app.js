const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Task schema
const Task = mongoose.model('Task', new mongoose.Schema({
  id:     Number,
  name:   String,
  status: String
}));

// GET /tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({}, { _id: 0, __v: 0 });
  res.json(tasks);
});

app.listen(3000, () => console.log('App running on port 3000'));