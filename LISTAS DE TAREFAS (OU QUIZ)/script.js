document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    function addTask() {
        const tarefa = taskInput.value.trim();

        if (tarefa === "") {
            alert("Por favor, insira uma tarefa.");
            return;
        }

        const taskItem = document.createElement("li");

        const taskContent = document.createElement("span");
        taskContent.textContent = tarefa;

        const concluido = document.createElement("button");
        concluido.textContent = "✔️";
        concluido.style.backgroundColor = "#28a745";
        concluido.style.color = "#fff";
        concluido.style.border = "none";
        concluido.style.padding = "5px";
        concluido.style.marginRight = "5px";
        concluido.style.borderRadius = "5px";
        concluido.style.cursor = "pointer";

        concluido.addEventListener("click", () => {
            taskContent.classList.toggle("completed");
        });

        const apagar = document.createElement("button");
        apagar.textContent = "🗑️";
        apagar.style.backgroundColor = "#dc3545";
        apagar.style.color = "#fff";
        apagar.style.border = "none";
        apagar.style.padding = "5px";
        apagar.style.borderRadius = "5px";
        apagar.style.cursor = "pointer";

        apagar.addEventListener("click", () => {
            taskItem.remove();
        });

        taskItem.appendChild(taskContent);
        taskItem.appendChild(concluido);
        taskItem.appendChild(apagar);

        taskList.appendChild(taskItem);

        taskInput.value = "";
    }

    addTaskBtn.addEventListener("click", addTask);

    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") addTask();
    });
});
