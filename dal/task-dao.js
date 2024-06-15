import pg from 'pg'
import { TaskStatus, Task } from '../model/task.js'
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const { Pool } = pg

class TaskDao {

    constructor(pool) {
        this.pool = pool
    }

    rowToTask(row) {
        return new Task(
            row.id,
            row.name,
            row.description,
            row.status_id,
            row.expected_completion_date
        )
    }

    async getAttachedFiles(id) {
        try {
            const taskUploadDirPath = 'uploads'
            const files = await readdir(taskUploadDirPath);
            for (const file of files) {
                console.log(file);
            }
        } catch (err) {
            console.error(err);
        } 
    }

    async add(task) {

        try {
            const result = await this.pool.query(`
                INSERT INTO
                    task
                    (name, description, status_id, expected_completion_date)
                VALUES
                    (
                        '${task.name}',
                        '${task.description}',
                        ${task.statusId},
                        '${task.expectedCompletionDate}'
                    );`
            )

            console.log(result)
            return result
        } catch (error) {
            console.log(error)
        }

    }

    async getAll() {
        const result = await this.pool.query(
            'SELECT * FROM task'
        )

        const tasks = []
        result.rows.forEach(row => {
            tasks.push(
                this.rowToTask()
            )
        })

        console.log("The end of get all")
        return tasks
    }

    async deleteById(id) {
        await this.pool.query(
            'DELETE * FROM task WHERE id = $1',
            [id]
        )
    }

    async getById(id) {
        const queryRes = await this.pool.query(
            'SELECT * FROM task WHERE id = $1',
            [id]
        )

        const nRows = queryRes.rows.length

        if (nRows == 0) {
            return null
        }

        return this.rowToTask(queryRes.rows[0])
    }
    
    async getByName(name) {
        const queryRes = await this.pool.query(
            'SELECT * FROM task WHERE name = $1',
            [name]
        )

        const nRows = queryRes.rows.length

        if (nRows == 0) {
            return null
        }

        return this.rowToTask(queryRes.rows[0])
    }

    async update(task) {
        let updatePart = ""

        let taskIsUpdated = false

        if (task.name != null) {
            taskIsUpdated = true
            updatePart += `, name='${task.name}'`
        }

        if (task.description != null) {
            taskIsUpdated = true
            updatePart += `, description='${task.description}'`
        }

        if (task.statusId != null) {
            taskIsUpdated = true
            updatePart += `, status_id=${task.statusId}`
        }

        if (task.expectedCompletionDate != null) {
            taskIsUpdated = true
            updatePart += `, expected_completion_date='${task.expectedCompletionDate}'`
        }

        if (!taskIsUpdated) {
            return
        }

        updatePart = updatePart.substring(2)

        await this.pool.query(
            `UPDATE task SET ${updatePart} WHERE id = ${task.id};`
        )
    }

    async destroy() {
        await this.pool.end()
    }

}

export { TaskDao }

