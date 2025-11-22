import "./style.css";

import {Todo} from "./components/todo.js"
import {Project} from "./components/project.js"
import {createTodoCard} from "./UI/todo-card.js"
import { editIcon } from "./UI/icons.js";


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
const dueDateEl = document.querySelector("#task-dueDate");
const removeDoneTasksEl = document.querySelector(".remove-done-tasks");



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

const saveDataToLocalStorage = () => {
    const raw = projectList.map(project => ({
        title: project.title,
        id: project.id,
        selected: false,
        todoList: project.todoList.map(todo => todo.getData())
    }));

    localStorage.setItem("projectList", JSON.stringify(raw));
};

const startApp = () => {
    const raw = JSON.parse(localStorage.getItem("projectList") || "[]");

    projectList = raw.map(projectRaw => {
        const todoList = (projectRaw.todoList || []).map(todoRaw =>
            new Todo(
                todoRaw.title,
                todoRaw.description,
                todoRaw.dueDate,
                todoRaw.important,
                todoRaw.done,
                todoRaw.descriptionVisible,
                todoRaw.id
            )
        );

        return new Project(
            projectRaw.title,
            todoList,
            projectRaw.selected,
            projectRaw.id
        );
    });
    console.dir(projectList);
    renderProjectList();
    project = undefined;
};

startApp();

const todayDate = new Date().toISOString().split("T")[0];
dueDateEl.setAttribute("min", todayDate);

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
    const remainingTasksEl = document.createElement("h2");

    projectTitleEl.textContent = project.title;
    remainingTasksEl.textContent = `Remaining tasks: ${countRemainingTasks(project)}`;
    headerEl.append(projectTitleEl, remainingTasksEl);

    project.todoList.forEach(todo => {
        const todoEl = createTodoCard(todo);
        todoListEl.appendChild(todoEl);
    })
};



const resetDisplay = () => {
    
    main.hidden = true;
    header.innerHTML = "";
};

const renderTodoDisplay = (project) => {
    main.hidden = false;
    renderTodos(project);
};


const countRemainingTasks = () => {
    const numberOfRemainingTasks = project.todoList.reduce((counter, todo) => {
        if (!todo.done) {counter++};
        return counter;
    }, 0);
    return numberOfRemainingTasks;
};

const removeDoneTasks = () => {
    project.todoList.forEach((todo, todoIndex) => {
        if (todo.done) {
            project.todoList.pop(todoIndex);
        }
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

    saveDataToLocalStorage();

    renderTodoDisplay(project);
});

cancelButtonEl.forEach(btn => btn.addEventListener("click", handleCancelForm));

todoListEl.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() !== "ul") {
        const todoEl = e.target.closest("li");
        const todoIndex = project.getTodoIndex(todoEl.dataset.id);
        const todo = project.todoList[todoIndex];

        if (e.target.classList.contains("delete")) {
            project.deleteTodo(todoEl.dataset.id);
            renderTodos(project);
            saveDataToLocalStorage();
        } else if (e.target.classList.contains("important-checkbox")) {
            todo.toggleImportant();
            renderTodos(project);
            saveDataToLocalStorage();
        } else if (e.target.classList.contains("done-checkbox")) {
            todo.toggleDone();
            renderTodos(project);
            
            saveDataToLocalStorage();
        } else if (e.target.classList.contains("todoCard-expand-button")) {
            todo.toggleDescriptionVisible();
            renderTodos(project);
            
            saveDataToLocalStorage();
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
        project.title = form.get("project-name");
        projectFormEl.removeAttribute("data-projectid");
        project.toggleSelected();
    } else {
        project = new Project(form.get("project-name"));
        project.toggleSelected();
        projectList.push(project);
    }
    
    projectModalEl.close();
    projectFormEl.reset();

    saveDataToLocalStorage();
    
    renderProjectList();
    renderTodoDisplay(project);
});

projectListEl.addEventListener("click", (e) => {
    if (e.target.tagName.toLowerCase() !== "ul") {
        const projectId = e.target.closest("li").id;
        if (e.target.classList.contains("project-link")) {
            
            if (project) {project.toggleSelected();};

            project = projectList.find(item => item.id === projectId);
            project.toggleSelected();
            
            saveDataToLocalStorage();
            renderProjectList();
            renderTodoDisplay(project);

        } else if (e.target.classList.contains("delete")) {
            projectList = projectList.filter(item => !(item.id === projectId));
            saveDataToLocalStorage();
            renderProjectList();
            resetDisplay();
        } else if (e.target.classList.contains("edit")) {
            projectModalEl.showModal();
            projectFormEl.setAttribute("data-projectid", projectId);
            const projectNameEl = projectFormEl.querySelector("#project-name");
            projectNameEl.value = project.title;
        }
    }
});

removeDoneTasksEl.addEventListener("click", () => {
    removeDoneTasks();
    saveDataToLocalStorage();
    renderTodos(project);
});





