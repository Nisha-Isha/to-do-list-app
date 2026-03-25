const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");


// 🔔 Ask notification permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

window.onload = loadTasks;

addBtn.addEventListener("click", addTask);

function addTask() {
    const text = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (text === "") {
        alert("Enter a task");
        return;
    }

    const task = { text, date, time, completed: false, alerted: false };

    createTask(task);
    saveTask(task);

    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
}

function createTask(task) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = `${task.text} ${task.date ? "📅 " + task.date : ""} ${task.time ? "⏰ " + task.time : ""}`;

    if (task.completed) span.classList.add("completed");

    span.onclick = () => {
        span.classList.toggle("completed");
        updateStorage();
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";

    delBtn.onclick = () => {
        li.remove();
        updateStorage();
    };

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));
}

function updateStorage() {
    let tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector("span").textContent;
        tasks.push({ text, completed: false, alerted: false });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* 🔔 Notification */
function showNotification(text) {
    if (Notification.permission === "granted") {
        new Notification("⏰ Reminder", {
            body: text
        });
    }
}

/* ⏰ Reminder */
function checkReminders() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let now = new Date();

    tasks.forEach(task => {
        if (task.date && task.time && !task.alerted) {
            let taskTime = new Date(`${task.date}T${task.time}`);

            if (now >= taskTime) {
                showPopup(task.text);
                showNotification(task.text);
                alarmSound.play();
                task.alerted = true;
            }
        }
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

setInterval(checkReminders, 1000);

/* Popup */
function showPopup(text) {
    document.getElementById("popupText").innerText = "⏰ " + text;
    document.getElementById("reminderPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("reminderPopup").style.display = "none";
    alarmSound.pause();
    alarmSound.currentTime = 0;
}