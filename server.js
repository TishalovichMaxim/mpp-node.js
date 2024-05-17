import { TaskStatus, Task } from './model/task.js'
import { readFile } from 'node:fs'
import express from 'express'

const app = express()
app.use(express.urlencoded({extended: true}))

const port = 8080

const tasks = [
    new Task("Task1", "Desc1", TaskStatus.TODO),
    new Task("Task2", "Desc2", TaskStatus.DOING),
    new Task("Task3", "Desc3", TaskStatus.DONE)
]

app.get('/sign-in', (req, res) => {
    res.render('sign-in.ejs')
})

app.get('/tasks', (req, res) => {
    res.render('tasks.ejs', {tasks: tasks})
})

app.get('/add-task-form', (req, res) => {
    res.render('add-task-form.ejs')
})

app.post('/tasks', (req, res) => {
    const task = new Task(
        req.body.name,
        req.body.description,
        req.body.status
    )

    tasks.push(task)

    res.redirect('/tasks')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

