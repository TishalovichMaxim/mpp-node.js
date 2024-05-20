import { TaskStatus, Task } from './model/task.js'
import { readFile } from 'node:fs'
import express from 'express'

const app = express()
app.use(express.urlencoded({extended: true}))

const port = 8080

let nextId = 4 

const tasks = [
    new Task(1, "Task1", "Desc1", 0, '2024-11-03'),
    new Task(2, "Task2", "Desc2", 1, '2024-11-03'),
    new Task(3, "Task3", "Desc3", 2, '2024-11-03')
]

app.get('/sign-in', (req, res) => {
    res.render('sign-in.ejs')
})


app.get('/add-task-form', (req, res) => {
    res.render('add-task-form.ejs')
})


app.route('/tasks')
    .get((req, res) => {
        res.render('tasks.ejs', {tasks: tasks})
    })
    .post((req, res) => {
        const task = new Task(
            nextId,
            req.body.name,
            req.body.description,
            req.body.status,
            req.body.completionDate
        )
    
        tasks.push(task)
        nextId++
    
        res.redirect('/tasks')
    })

app.get('/tasks/:id', (req, res) => {
    const taskId = req.params.id
    console.log(`Task id = ${taskId}`)

    const task = tasks.filter(t => t.id == taskId)[0]

    if (task == undefined) {
        console.log("Task is undefined")
    } else {
        res.render('update-task-info.ejs', {task: task})
    }
})

app.post('/tasks/:id/update', (req, res) => {

    const taskId = req.params.id

    const task = tasks.filter(t => t.id == taskId)[0]

    if (task == undefined) {
        console.log("Task is undefined")
    } else {
        const name = req.body.name
        const description = req.body.description
        const statusId = Number(req.body.statusId) // add here check that statusId possible convert ot Number
        const expectedCompletionDate = req.body.expectedCompletionDate

        task.name = name
        task.description = description
        task.statusId = statusId
        task.expectedCompletionDate = expectedCompletionDate
    }

    res.redirect('/tasks')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

