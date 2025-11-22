export class Todo {
    constructor(title, description, dueDate, important = false, done = false, descriptionVisible = true, id) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.important = important;
        this.done = done;
        this.id = id || crypto.randomUUID();
        this.descriptionVisible = descriptionVisible;
    }
    updateTitle (newTitle) {this.title = newTitle}
    updateDescription (newDescription) {this.description = newDescription}
    updateDueDate (newDueDate) {this.dueDate = newDueDate}
    toggleImportant () {this.important = !this.important}
    toggleDone () {this.done = !this.done}
    toggleDescriptionVisible () {this.descriptionVisible = !this.descriptionVisible}
    getData () {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            important: this.important,
            done: this.done,
            descriptionVisible: this.descriptionVisible,
            id: this.id,
        };
    }
}