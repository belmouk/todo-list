import "./style.css";

import {Todo} from "./components/todo.js"
import {Project} from "./components/project.js"
import {createTodoCard} from "./UI/todo-card.js"
import { editIcon } from "./UI/icons.js";

const todo1 = new Todo("Read book", "Read Atomic habits", "21st november 2025");
const todo2 = new Todo("Write code", "Write the todo App", "30th november 2025");

let projectList = [];
let project;


const addTaskButtonEl = document.querySelector("main>button");
const newProjectButtonEl = document.querySelector("nav>button");
const todoListEl =document.querySelector("main>ul");
const projectListEl = document.querySelector("nav>ul");
const todoModalEl = document.querySelector(".modal.todo");
const todoFormEl = document.querySelector(".modal.todo>form");
const todoCardEl = document.querySelectorAll(".todoCard");
const cancelButtonEl = document.querySelectorAll(".cancel");
const headerEl = document.querySelector("header");
const projectModalEl = document.querySelector(".modal.project");
const projectFormEl = document.querySelector(".modal.project>form");
const main = document.querySelector("main");
const header = document.querySelector("header");





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

    if (todoFormEl.getAttributeNames().includes("data-todoid")) {
        todo.id = todoFormEl.dataset.todoid;
        project.editTodo(todo);
        todoFormEl.removeAttribute("data-todoID");
    } else {
        project.addTodo(todo);
    }
    
    todoFormEl.reset();
    todoModalEl.close();

    renderTodoDisplay(project);
});

cancelButtonEl.forEach(btn => btn.addEventListener("click", handleCancelForm));

todoListEl.addEventListener("click", (e) => {
    const todoEl = e.target.closest("li");
    const todoIndex = project.getTodoIndex(todoEl.dataset.id);
    const todo = project.todoList[todoIndex];

    if (e.target.classList.contains("delete")) {
        project.deleteTodo(todoEl.dataset.id);
        renderTodos(project);
    } else if (e.target.classList.contains("important-checkbox")) {
        todo.toggleImportant();
        renderTodos(project);
    } else if (e.target.classList.contains("done-checkbox")) {
        todo.toggleDone();
        renderTodos(project);
    } else if (e.target.classList.contains("todoCard-expand-button")) {
        todo.toggleDescriptionVisible();
        renderTodos(project);
    } else if (e.target.classList.contains("edit")) {
        todoModalEl.showModal();
        const formTitleEl = document.querySelector("#task-title");
        const formDescriptionEl = document.querySelector("#task-description");
        const formDueDateEl = document.querySelector("#task-dueDate");
        const formImportantEl = document.querySelector("#task-important");

        formTitleEl.value = todo.title;
        formDescriptionEl.value = todo.description;
        formDueDateEl.value = todo.dueDate;
        formImportantEl.checked = todo.important;

        todoFormEl.setAttribute("data-todoid", todo.id);
        const legendEl = todoFormEl.querySelector("legend");
        legendEl.textContent = "Edit Task";

    }
});

newProjectButtonEl.addEventListener("click", () => {
    projectModalEl.showModal();
});

projectFormEl.addEventListener("submit", (e) => {
    e.preventDefault();

    if (project) {project.toggleSelected()};

    const form = new FormData(projectFormEl);
    
    if (projectFormEl.getAttributeNames().includes("data-projectid")) {
        const projectToEdit = projectList.find(item => item.id === projectFormEl.dataset.projectid);
        projectToEdit.title = form.get("project-name");
        projectFormEl.removeAttribute("data-projectid");
        project.toggleSelected();
    } else {
        project = new Project(form.get("project-name"));
        project.toggleSelected();
        projectList.push(project);
    }
    
    projectModalEl.close();
    projectFormEl.reset();
    
    renderProjectList();
    renderTodoDisplay(project);
});

projectListEl.addEventListener("click", (e) => {
    const projectId = e.target.closest("li").id;
    if (e.target.classList.contains("project-link")) {
        const currentSelectedProjectIndex = projectList.findIndex(item=> item.id === projectId);
        const oldSelectedProjectIndex = projectList.findIndex(item=> item.id === project.id);
        projectList[oldSelectedProjectIndex].toggleSelected();
        projectList[currentSelectedProjectIndex].toggleSelected();
        project = projectList.find(item => item.id === projectId);
        renderProjectList();
        renderTodoDisplay(project);
    } else if (e.target.classList.contains("delete")) {
        projectList = projectList.filter(item => !(item.id === projectId));
        renderProjectList();
        resetDisplay();
    } else if (e.target.classList.contains("edit")) {
        projectModalEl.showModal();
        projectFormEl.setAttribute("data-projectid", projectId);
        const projectNameEl = projectFormEl.querySelector("#project-name");
        projectNameEl.value = project.title;
    }
})

const renderProjectList = () => {
    projectListEl.innerHTML = "";
    projectList.forEach(project => {
        const li = document.createElement("li");
        const projectButtonEl = document.createElement("button");
        const projectDeleteButtonEl = document.createElement("button");
        const editProjectButtonEl = document.createElement("button");

        projectButtonEl.classList.add("project-link", "btn");
        projectDeleteButtonEl.classList.add("delete", "btn");
        editProjectButtonEl.classList.add("edit");
        editProjectButtonEl.innerHTML = editIcon;

        li.id = project.id;
        projectButtonEl.textContent = project.title;
        projectDeleteButtonEl.textContent = "X";

        if (project.selected) {
            projectButtonEl.classList.add("project-selected")
        } else {
            projectButtonEl.classList.remove("project-selected")
        }

        li.append(projectButtonEl, editProjectButtonEl, projectDeleteButtonEl);
        
        projectListEl.appendChild(li);
    });
};

const resetDisplay = () => {
    
    main.hidden = true;
    header.innerHTML = "";
}

const renderTodoDisplay = (project) => {
    main.hidden = false;
    renderTodos(project);
};