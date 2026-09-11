const tasks = [];

const form = document.querySelector("#tsk-add-form");
const tskList = document.querySelector("#tsk-list");


form.addEventListener("submit", function(event) {
    event.preventDefault();

    addTask(
        document.querySelector("#tsk-name-in").value,
        document.querySelector("#tsk-priority-in").value
    );
    
    buildTaskList();
});


function addTask(name,priority) {
    const task = {
        name: name,
        priority: priority,
        completed: false
    }

    tasks.push(task);
}

function buildTaskList() {
    tskList.innerHTML = ''; // Reset

    tasks.forEach(function(task) {
        const container = document.createElement("div")
        container.classList.add("task");

        const name = document.createElement("span")
        name.classList.add("tsk-name");
        name.textContent = task.name;
        container.appendChild(name);

        const priority = document.createElement("span")
        priority.classList.add("tsk-priority");
        priority.classList.add(`priority-${task.priority}`);
        priority.textContent = task.priority;
        container.appendChild(priority);

        const tskCompleteBox = document.createElement("input");
        tskCompleteBox.classList.add("tsk-complete-box");
        if (task.completed) {
            container.classList.add("completed");
        }

        tskCompleteBox.type = "checkbox";
        tskCompleteBox.checked = task.completed;
        container.appendChild(tskCompleteBox);
        tskCompleteBox.addEventListener("change", function() {
            task.completed = tskCompleteBox.checked;
            buildTaskList();
        });
        
        tskList.appendChild(container);
    });
}