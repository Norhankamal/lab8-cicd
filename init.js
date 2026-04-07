db = db.getSiblingDB('tasksdb');

db.tasks.insertMany([
  { id: 1, name: 'Task 1', status: 'pending' },
  { id: 2, name: 'Task 2', status: 'in-progress' },
  { id: 3, name: 'Task 3', status: 'done' },
  { id: 4, name: 'Task 4', status: 'pending' },
  { id: 5, name: 'Task 5', status: 'done' },
  { id: 6, name: 'Task 6', status: 'in-progress' }
]);