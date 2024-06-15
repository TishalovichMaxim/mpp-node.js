const TaskStatus = Object.freeze({
    TODO: "TODO",
    DOING: "Doing",
    DONE: "Done"
})

const idToStatus = new Map([
    [0, TaskStatus.TODO],
    [1, TaskStatus.DOING],
    [2, TaskStatus.DONE],
])

class TaskStatusMapper {

    static map(id) {
        return idToStatus.get(id)
    }

}

class Task {

    constructor(id, name, description, statusId, expectedCompletionDate) {
        this.id = id
        this.name = name
        this.description = description
        this.statusId = statusId
        this.expectedCompletionDate = expectedCompletionDate
    }

    status() {
        return TaskStatusMapper.map(this.statusId)
    }

}

export { Task, TaskStatus }

