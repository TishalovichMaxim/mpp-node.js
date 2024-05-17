import { TaskStatus, Task } from './model/task.js'
import { readFile } from 'node:fs'
import express from 'express'

const app = express()
const port = 8080

app.get('/tasks', (req, res) => {
    const tasks = [
        new Task("Task1", "Desc1", TaskStatus.TODO),
        new Task("Task2", "Desc2", TaskStatus.DOING),
        new Task("Task3", "Desc3", TaskStatus.DONE)
    ]

    res.render('tasks.ejs', {tasks: tasks})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
