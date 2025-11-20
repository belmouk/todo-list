import "./style.css";

import {Todo} from "./components/todo.js"
import {Project} from "./components/project.js"
import {createTodoCard} from "./UI/todo-card.js"

const todo1 = new Todo("read book", "Read Atomic habits", "21st november 2025");
const todo2 = new Todo("write code", "Write the todo App", "30th november 2025");

const project = new Project("November tasks");

todo1.toggleDone();
todo1.toggleImportant();

const todo1Card = createTodoCard(todo1);

const cardSection = document.querySelector("main>ul");

cardSection.appendChild(todo1Card);