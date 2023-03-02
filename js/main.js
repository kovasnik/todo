const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');

let tasks = [];

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => showTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);

taskList.addEventListener('click', deleteTask);

taskList.addEventListener('click', doneTask)

function addTask(event){
    event.preventDefault();
    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    showTask(newTask);

    taskInput.value = "";
    taskInput.focus();
    checkEmptyList();
}

function deleteTask(event) {
    if(event.target.dataset.action !== 'delete'){return}

    const parentNode = event.target.closest('.list-group-item');
    const id = Number(parentNode.id);
    const index = tasks.findIndex((task) => task.id === id);

    tasks.splice(index, 1);
    saveToLocalStorage();

    parentNode.remove();
    checkEmptyList();
}

function doneTask(event) {
    if(event.target.dataset.action !== 'done'){return}

    const parentNode = event.target.closest('.list-group-item')
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);

    task.done = !task.done
    saveToLocalStorage();

    parentNode.querySelector('.task-title').classList.toggle('task-title--done');
}

function checkEmptyList(){
    if(tasks.length === 0){
        const emptyListElement =
                `<li id="emptyList" class="list-group-item empty-list">
                    <img src="./img/box.svg" alt="Empty" width="60" class="mt-3">
                    <div class="empty-list__title">To-do list is empty</div>
                 </li>`;
        taskList.insertAdjacentHTML('afterbegin', emptyListElement);
    }


    if(tasks.length > 0){
        const emptyList = document.querySelector('#emptyList');
        emptyList ? emptyList.remove() : null;
    }
}

function showTask(task){
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    const taskHtml = `
                    <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item ">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;

    taskList.insertAdjacentHTML('beforeend', taskHtml);
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
}