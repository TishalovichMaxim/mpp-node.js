import pg from 'pg'
const { Client } = pg

class TaskDao {

    constructor() {
        this.client = new Client({
            user: 'postgres',
            password: 'password',
            host: 'localhost',
            port: 5432,
            database: 'tasks-db'
        })
    }

    async init() {
        await this.client.connect()
    }

    async add(task) {
        const result = await this.client.query(
            'INSERT INTO tasks (name, description, status) VALUES ($1, $2, $3)',
            [task.name, task.description, task.status]
        )
    }
    
    async destroy() {
        await this.client.end()
    }

}

export { TaskDao }
