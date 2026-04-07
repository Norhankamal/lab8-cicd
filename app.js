const express = require("express");
const app = express();
const PORT = 3000;

let tasks = [
    { id: 1, name: "Task 1", status: "pending" },
    { id: 2, name: "Task 2", status: "done" }
];

app.get("/tasks", (req, res) => {
    res.json(tasks);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));