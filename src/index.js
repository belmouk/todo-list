import "./style.css";

import {Todo} from "./components/todo.js"
import {Project} from "./components/project.js"
import {createTodoCard} from "./UI/todo-card.js"
import { collapseIcon, expandIcon } from "./UI/icons.js";

const todo1 = new Todo("Read book", "Read Atomic habits", "21st november 2025");
const todo2 = new Todo("Write code", "Write the todo App", "30th november 2025");

const project = new Project("November tasks");


const addTaskButtonEl = document.querySelector("main>button");
const newProjectButtonEl = document.querySelector("nav>button");
const todoListEl =document.querySelector("main>ul");
const projectListEl = document.querySelector("nav>ul");
const todoModalEl = document.querySelector(".modal.todo");
const todoFormEl = document.querySelector(".modal.todo>form");
const todoCardEl = document.querySelectorAll(".todoCard");
const cancelButtonEl = document.querySelectorAll(".cancel");
const headerEl = document.querySelector("header");


const handleCancelForm = (e) => {
    const formEl = e.target.closest("form");
    const modalEl = e.target.closest("dialog");
    formEl.reset();
    modalEl.close();
};

const renderTodos = (project) => {
    todoListEl.innerHTML = "";
    headerEl.innerHTML = "";
    
    const projectTitleEl = document.createElement("h1");
    projectTitleEl.textContent = project.title;
    headerEl.appendChild(projectTitleEl);

    project.todoList.forEach(todo => {
        const todoEl = createTodoCard(todo);
        todoListEl.appendChild(todoEl);
    })
};


addTaskButtonEl.addEventListener("click", (e) => {
    todoModalEl.showModal();
});

todoFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    const form = new FormData(todoFormEl);

    const title = form.get("task-title");
    const description = form.get("task-description");
    const dueDate = form.get("task-dueDate");
    const important = form.get("task-important");

    const todo = new Todo(title, description, dueDate);
    if (important === "on") {todo.toggleImportant()};

    project.addTodo(todo);
    todoFormEl.reset();
    todoModalEl.close();

    const todoEl = createTodoCard(todo);
    todoListEl.appendChild(todoEl);
});



cancelButtonEl.forEach(btn => btn.addEventListener("click", handleCancelForm));




todoListEl.addEventListener("click", (e) => {
    const todoEl = e.target.closest("li");
    if (e.target.classList.contains("delete")) {
        project.deleteTodo(todoEl.dataset.id);
        renderTodos(project);
    } else if (e.target.classList.contains("important-checkbox")) {
        const todoIndex = project.getTodoIndex(todoEl.dataset.id);
        const todo = project.todoList[todoIndex];
        todo.toggleImportant();
        renderTodos(project);
    } else if (e.target.classList.contains("done-checkbox")) {
        const todoIndex = project.getTodoIndex(todoEl.dataset.id);
        const todo = project.todoList[todoIndex];
        todo.toggleDone();
        renderTodos(project);
    } else if (e.target.classList.contains("todoCard-expand-button")) {
        const todoIndex = project.getTodoIndex(todoEl.dataset.id);
        const todo = project.todoList[todoIndex];
        todo.toggleDescriptionVisible();
        renderTodos(project);
    }
});

