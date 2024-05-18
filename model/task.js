const TaskStatus = Object.freeze({
    TODO: "TODO",
    DOING: "Doing",
    DONE: "Done"
})

class Task {
    constructor(name, description, status, expectedCompletionDate) {
        this.name = name
        this.description = description
        this.status = status
        this.expectedCompletionDate = expectedCompletionDate
    }
}

export { Task, TaskStatus }

