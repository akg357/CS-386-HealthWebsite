// Load tasks on page load
document.addEventListener("DOMContentLoaded", () => {
    resetIfNewDay();
    loadTasks();
    scheduleMidnightReset();  // NEW: Reset without refreshing
});

// Add a task
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") return;

    const tasks = getTasks();
    tasks.push({ text, completed: false });
    saveTasks(tasks);
    input.value = "";

    loadTasks();
}

// Toggle task completion
function toggleTask(index) {
    const tasks = getTasks();
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    loadTasks();
}

// Delete one task (NEW)
function deleteTask(index) {
    const tasks = getTasks();
    tasks.splice(index, 1);
    saveTasks(tasks);
    loadTasks();
}

// Clear all tasks (NEW)
function clearTasks() {
    localStorage.setItem("dailyTasks", JSON.stringify([]));
    loadTasks();
}

// Load tasks list
function loadTasks() {
    const ul = document.getElementById("taskList");
    const tasks = getTasks();

    ul.innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        
        // Task text
        const span = document.createElement("span");
        span.textContent = task.text;
        if (task.completed) span.classList.add("completed");
        span.onclick = () => toggleTask(index);

        // Delete button
        const btn = document.createElement("button");
        btn.textContent = "X";
        btn.classList.add("delete-btn-tasks");
        btn.onclick = (e) => {
            e.stopPropagation();  // prevent accidental toggle
            deleteTask(index);
        };

        li.appendChild(span);
        li.appendChild(btn);
        ul.appendChild(li);
    });
}

function getTasks() {
    return JSON.parse(localStorage.getItem("dailyTasks") || "[]");
}

function saveTasks(tasks) {
    localStorage.setItem("dailyTasks", JSON.stringify(tasks));
}

// Reset at midnight with no refresh (NEW)
function scheduleMidnightReset() {
    const now = new Date();
    
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);  // next midnight

    const msUntilMidnight = midnight - now;

    setTimeout(() => {
        clearTasks();              // wipe tasks
        localStorage.setItem("taskDate", new Date().toLocaleDateString());
        scheduleMidnightReset();   // schedule next midnight
    }, msUntilMidnight);
}

// Reset if date changed since last load
function resetIfNewDay() {
    const today = new Date().toLocaleDateString();
    const savedDate = localStorage.getItem("taskDate");

    if (savedDate !== today) {
        localStorage.setItem("taskDate", today);
        localStorage.setItem("dailyTasks", JSON.stringify([]));
    }
}

export { scheduleMidnightReset, clearTasks };
