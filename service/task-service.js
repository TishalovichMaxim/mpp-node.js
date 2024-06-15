import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

class TaskService {

    constructor(taskDao) {
        this.dao = taskDao
    }

    async getById(id) {
        const task = await this.dao.getById(id)

        return task
    }

    async add(task) {
        await this.dao.add(task)

        const newTask = await this.dao.getByName(task.name)

        if (newTask == null) {
            return
        }
        
        let newDirPath = join('uploads', newTask.id.toString())

        console.log(newDirPath)

        const dirCreation = await mkdir(newDirPath)
    }

}

export { TaskService }

