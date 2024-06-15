import { createHash } from 'node:crypto'
import { User } from '../model/user.js'

class Auth {

    constructor(userDao) {
        this.dao = userDao
        this.hash = createHash('sha256')
    }

    async signIn(login, password) {
        const passwordHash = this.hash(password)

        const user = await this.dao.getByLogin(login)

        if (user == null) {
            //throw exception here
        }

        if (user.passwordHash != passwordHash) {
            //throw exception here
        }

        return user
    }

    async signUp(login, password, repeatedPassword) {
        if (password != repeatedPassword) {
            //throw exception here
        }

        const passwordHash = this.hash(password)
        const user = new User(null, login, passwordHash)

        this.dao.save(user)

        return this.dao.getByLogin(login)
    }

}

