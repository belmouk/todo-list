import {importantIcon, collapseIcon, expandIcon, editIcon} from "./icons.js"
import { format } from "date-fns";

export const createTodoCard = (todo) => {
    const todoCardEl = document.createElement("li");

    //card description
    const todoDescriptionEl = document.createElement("p");
    todoDescriptionEl.textContent = todo.description;
       
    //card header
    const todoTitleSectionEl = document.createElement("div");
    const todoTitleEl = document.createElement("h2");
    const deleteButtonEl = document.createElement("button");
    const doneEl = document.createElement("input");
    const cardActionEl = document.createElement("div");
    const importantEl = document.createElement("input");
    const todoCardTitleContainerEl = document.createElement("div");
    const importantLabelEl = document.createElement("label");
    const expandEl = document.createElement("button");
    const updateButtonEl = document.createElement("button");
    const dateEl = document.createElement("div");
    
    dateEl.classList.add("todoCard-date");
    dateEl.textContent = format(todo.dueDate, "EE, MMM do, yyyy");

    expandEl.classList.add("todoCard-expand-button");
    
    todoTitleEl.textContent = todo.title;

    doneEl.setAttribute("type", "checkbox");
    doneEl.checked = todo.done;
    doneEl.classList.add("done-checkbox");

    importantEl.setAttribute("type", "checkbox");
    importantEl.checked = todo.important;
    importantEl.classList.add("important-checkbox");
    importantEl.id = `todoCard-important-${todo.id}`;

    importantLabelEl.setAttribute("for", `todoCard-important-${todo.id}`);
    importantLabelEl.innerHTML = importantIcon;

    importantLabelEl.appendChild(importantEl);

    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.classList.add("delete", "btn");

    todoCardTitleContainerEl.classList.add("todoCard-header-container");
    todoCardTitleContainerEl.append(doneEl, todoTitleEl)

    updateButtonEl.innerHTML = editIcon;
    updateButtonEl.classList.add("edit");

    cardActionEl.append(dateEl, deleteButtonEl, updateButtonEl, importantLabelEl, expandEl);
    cardActionEl.classList.add("todoCard-actions")

    todoTitleSectionEl.append(todoCardTitleContainerEl, cardActionEl);
    todoTitleSectionEl.classList.add("todoCard-title");

    //assembling card
    todoCardEl.append(todoTitleSectionEl, todoDescriptionEl);
    todoCardEl.classList.add("todoCard");
    todoCardEl.setAttribute("data-id", todo.id)
    
    //card visual state logic
    if (todo.important) {
        todoCardEl.classList.add("todo-important");
        importantEl.checked = true;
    } 

    if (todo.done) {
        todoCardEl.classList.add("todo-done");
        doneEl.checked = true;
    }

    if (todo.descriptionVisible) {
        expandEl.innerHTML = collapseIcon;
        todoDescriptionEl.hidden = false;
    } else {
        expandEl.innerHTML = expandIcon;
        todoDescriptionEl.hidden = true;
    }

    return todoCardEl;
};