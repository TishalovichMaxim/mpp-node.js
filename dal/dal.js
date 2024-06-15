import pg from 'pg'
const { Pool } = pg

function createPool() {
    return new Pool({
        user: 'postgres',
        password: 'password',
        host: 'localhost',
        port: 5432,
        database: 'tasks-db'
    })
}

export { createPool }

