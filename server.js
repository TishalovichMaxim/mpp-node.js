import { TaskStatus, Task } from './model/task.js'
import { TaskDao } from './dal/task-dao.js'
import { UserDao } from './dal/user-dao.js'
import { createPool } from './dal/dal.js'
import { TaskService } from './service/task-service.js'
import { AuthService } from './service/auth-service.js'
import { readFile } from 'node:fs'
import pg from 'pg'
import express from 'express'
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `/uploads/${req.params.id}/`)
    }
})
const upload = multer({ storage: storage })

const { Pool } = pg
const pool = createPool()
const dao = new TaskDao(pool)
const userDao = new UserDao(pool)
const taskService = new TaskService()
const authService = new AuthService(userDao)

const app = express()
app.use(express.urlencoded({extended: true}))

let nextId = 4 

const tasks = [
    new Task(1, "Task1", "Desc1", 0, '2024-11-03'),
    new Task(2, "Task2", "Desc2", 1, '2024-11-03'),
    new Task(3, "Task3", "Desc3", 2, '2024-11-03')
]

app.get('/sign-up', (req, res) => {
    res.render('sign-up.ejs')
})

app.post('/sign-up', async (req, res) => {

    const login = req.body.login
    const password = req.body.password
    const repeatPassword = req.body["repeat-password"]

    console.log(login)
    console.log(password)
    console.log(repeatPassword)

    if (login == undefined || password == undefined || repeatPassword == undefined) {
        console.log(`Sign in error: login = ${login}, password = ${password}, repeat password = ${repeatPassword}`)
        res.redirect('/sign-up')
        return
    }

    const user = await authService.signUp(login, password, repeatPassword)
    if (user == undefined) {
        res.redirect('/sign-up')
        return
    }

    console.log(user)

    res.redirect('/tasks')
})

app.get('/sign-in', (req, res) => {
    res.render('sign-in.ejs')
})

app.post('/sign-in', async (req, res) => {

    const login = req.body.login
    const password = req.body.password

    if (login == undefined || password == undefined) {
        console.log(`Sign in error: login = ${login}, password = ${password}`)
        res.redirect('/sign-in')
        return
    }

    const user = await authService.signIn(login, password)
    if (user == undefined) {
        res.redirect('/sign-in')
        return
    }

    res.redirect('/tasks')
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

app.post('/tasks/:id/upload-file', upload.single('uploaded-file'), (req, res) => {

    const taskId = req.params.id

    const task = tasks.filter(t => t.id == taskId)[0]

    if (task == undefined) {
        console.log("Task is undefined")
    } else {
        console.log(`Task id = ${taskId}`)
    }

    res.redirect(`/tasks/${taskId}`)
})

const port = 8080
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

