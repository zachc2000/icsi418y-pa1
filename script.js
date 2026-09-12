const tasks = [];

const tskForm = document.querySelector("#tsk-add-form");
const tskList = document.querySelector("#tsk-list")

const tskImport = document.querySelector("#tsk-import");
const tskImportSelect = document.querySelector("#tsk-import-select");
const tskExport = document.querySelector("#tsk-export");
const tskClear = document.querySelector("#tsk-clear");

tskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    addTask(
        document.querySelector("#tsk-name-in").value,
        document.querySelector("#tsk-priority-in").value
    );
    
    tskForm.reset();
});

tskImport.addEventListener("click", function() {
    tskImportSelect.click();
})

tskImportSelect.addEventListener("change", async function() {
    const file = tskImportSelect.files[0];
    let data; 

    if (!file) return;
    try {
        const text = await file.text();
        data = JSON.parse(text);
    } catch {
        alert("Provided file is not valid JSON!");
        return;
    }

    importTasks(data);
});

tskExport.addEventListener("click", function() {
    exportTasks();
});

tskClear.addEventListener("click", function() {
    clearTasks();
})

//////

function isValidTask(task) {
    if (typeof task.name !== "string" || task.name.trim() === "") return false;
    if (! ["low", "medium", "high"].includes(task.priority)) return false;
    if (typeof task.completed !== "boolean") return false;

    return true;
}

function buildTaskList() {
    tskList.innerHTML = ''; // Reset

    tasks.forEach(function(task, i) {
        const container = document.createElement("div");
        container.classList.add("task");

        const name = document.createElement("span");
        name.classList.add("tsk-name");
        name.textContent = task.name;
        container.appendChild(name);

        const priority = document.createElement("span");
        priority.classList.add("tsk-priority");
        priority.classList.add(`priority-${task.priority}`);
        priority.textContent = task.priority;
        container.appendChild(priority);

        const completeBox = document.createElement("input");
        completeBox.classList.add("tsk-complete-box");
        if (task.completed) {
            container.classList.add("completed");
        } 
        completeBox.type = "checkbox";
        completeBox.checked = task.completed;
        container.appendChild(completeBox);
        completeBox.addEventListener("change", function() {
            task.completed = completeBox.checked;
            buildTaskList();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("tsk-delete-btn");
        deleteBtn.textContent = "\u00D7";
        container.appendChild(deleteBtn)
        deleteBtn.addEventListener("click", function() {
            tasks.splice(i, 1);
            buildTaskList();
        })
        
        tskList.appendChild(container);
    });
}

function addTask(name,priority) {
    const task = {
        name: name,
        priority: priority,
        completed: false
    };

    if (isValidTask(task)) tasks.push(task);

    buildTaskList();
}

function importTasks(data) {
    if (! Array.isArray(data)) {
        alert("Failed to parse task data from file!");
        return;
    }
    if (!data.every(isValidTask)) {
        alert("Failed to parse task data from file!");
        return;
    }

    tasks.splice(0, tasks.length, ...data);  

    buildTaskList();
}

function exportTasks() {
    const text = JSON.stringify(tasks, null, 2);

    const blob = new Blob([text], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks.json";
    link.click();

    URL.revokeObjectURL(url);
}

function clearTasks() {
    const confirmed = confirm("Are you sure you want to delete all tasks?\nThis cannot be undone");
    
    if (confirmed) {
        tasks.splice(0, tasks.length);
        buildTaskList();
    }
}