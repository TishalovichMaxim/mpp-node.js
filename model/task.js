const TaskStatus = Object.freeze({
    TODO: "TODO",
    DOING: "Doing",
    DONE: "Done"
})

class Task {
    constructor(name, description, status) {
        this.name = name
        this.description = description
        this.status = status
    }
}

export { Task, TaskStatus }

