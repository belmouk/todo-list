export class Project {
    constructor(title, todoList = [], selected= false, id) {
        this.title = title;
        this.todoList = todoList;
        this.id = crypto.randomUUID();
        this.selected = selected;
    }
    updateTitle(newTitle) {this.title = newTitle}

    addTodo(todo) {this.todoList.push(todo)}

    deleteTodo(todoId) {
        this.todoList = this.todoList.filter(item => !(item.id === todoId));
    }

    getTodoIndex(todoId) {
        return this.todoList.findIndex(item => (item.id === todoId));
    }

    getTodo = (todoId) => {
        return this.todoList.find(item => (item.id === todoId));
    }

    toggleSelected() {this.selected = !this.selected}

    editTodo = (todo) => {
        const todoToEdit = this.getTodo(todo.id);
        console.dir(todoToEdit);
        if (todoToEdit) {
            for (let key in todo) {
                todoToEdit[key] = todo[key];
            }
            console.log("success");
        } 
    }
};