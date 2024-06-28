import { createHash } from 'node:crypto'
import { User } from '../model/user.js'

class AuthService {

    constructor(userDao) {
        this.dao = userDao
        this.hash = createHash('sha256')
    }

    async signIn(login, password) {
        const passwordHash = this.hash.update(password).digest('hex').slice(0, 32)

        const user = await this.dao.getByLogin(login)

        if (user == null) {
            console.log("Uncorrect login")
            return
            //throw exception here
        }

        if (user.passwordHash != passwordHash) {
            console.log("Uncorrect login or password")
            return
            //throw exception here
        }

        return user
    }

    async signUp(login, password, repeatedPassword) {
        if (password != repeatedPassword) {
            console.log("Passwordes must be equal")
            return
            //throw exception here
        }

        const passwordHash = this.hash.update(password).digest('hex').slice(0, 32)
        const user = new User(null, login, passwordHash)

        console.log(typeof passwordHash)
        console.log(passwordHash)
        console.log(passwordHash.length)

        this.dao.save(user)

        return this.dao.getByLogin(login)
    }

}

export { AuthService }

