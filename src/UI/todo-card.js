export const createTodoCard = (todo) => {
    const todoCardEl = document.createElement("section");
    
    //card title
    const todoTitleSectionEl = document.createElement("div");
    const todoTitleEl = document.createElement("h2");
    const deleteButtonEl = document.createElement("button");
    const doneEl = document.createElement("input");
    const cardActionEl = document.createElement("div");

    todoTitleEl.textContent = todo.title;
    doneEl.setAttribute("type", "checkbox");
    doneEl.checked = todo.done;
    deleteButtonEl.textContent = "Delete";

    cardActionEl.append(deleteButtonEl, doneEl);
    cardActionEl.classList.add("todoCard-actions")

    todoTitleSectionEl.append(todoTitleEl, cardActionEl);

    //card description
    const todoDescriptionEl = document.createElement("p");
    todoDescriptionEl.textContent = todo.description;

    //assembling card
    todoCardEl.append(todoTitleSectionEl, todoDescriptionEl);
    todoCardEl.classList.add("todoCard");
    
    if (todo.important) {todoCardEl.classList.add("todo-important")}

    return todoCardEl;
};