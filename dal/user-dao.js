import pg from 'pg'
import { User } from '../model/user.js'

class UserDao {

    constructor(pool) {
        this.pool = pool
    }

    rowToUser(row) {
        return new User(
            row.id,
            row.login,
            row.password_hash
        )
    }

    async save(user) {
        const result = await this.pool.query(`
            INSERT INTO
                "user"
                (login, password_hash)
            VALUES
                (
                    '${user.login}',
                    '${user.passwordHash}'
                );`
        )
    }

    async getById(id) {
        const queryRes = await this.pool.query(
            'SELECT * FROM "user" WHERE id = $1',
            [id]
        )

        const nRows = queryRes.rows.length

        if (nRows == 0) {
            return null
        }

        return this.rowToUser(queryRes.rows[0])
    }

    async getByLogin(login) {
        const queryRes = await this.pool.query(
            'SELECT * FROM "user" WHERE login = $1',
            [login]
        )

        const nRows = queryRes.rows.length

        if (nRows == 0) {
            return null
        }

        return this.rowToUser(queryRes.rows[0])
    }

}

export { UserDao }

