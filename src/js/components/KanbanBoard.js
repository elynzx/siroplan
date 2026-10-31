import { createTaskCardHTML } from "./TaskCard.js";

export function renderKanbanBoard(taskManager, projectManager) {
  const todoContainer = document.getElementById("tasks-todo-container");
  const inprogressContainer = document.getElementById(
    "tasks-inprogress-container",
  );
  const doneContainer = document.getElementById("tasks-done-container");

  if (!todoContainer || !inprogressContainer || !doneContainer) return;

  todoContainer.innerHTML = "";
  inprogressContainer.innerHTML = "";
  doneContainer.innerHTML = "";

  const allTasks = taskManager.getAllTasks();

  const emptyTaskHTML = `
    <div class="empty-state-cozy">
        <i class='bx bx-heart bx-sm'></i>
        <p>Nothing here yet</p>
    </div>
  `;

  todoContainer.innerHTML = emptyTaskHTML;
  inprogressContainer.innerHTML = emptyTaskHTML;
  doneContainer.innerHTML = emptyTaskHTML;

  let hasTodo = false,
    hasInprogress = false,
    hasDone = false;

  allTasks.forEach((task) => {
    const cardHTML = createTaskCardHTML(task, projectManager);

    if (task.status === "To Do") {
      if (!hasTodo) {
        todoContainer.innerHTML = "";
        hasTodo = true;
      }
      todoContainer.innerHTML += cardHTML;
    }
    if (task.status === "In Progress") {
      if (!hasInprogress) {
        inprogressContainer.innerHTML = "";
        hasInprogress = true;
      }
      inprogressContainer.innerHTML += cardHTML;
    }
    if (task.status === "Done") {
      if (!hasDone) {
        doneContainer.innerHTML = "";
        hasDone = true;
      }
      doneContainer.innerHTML += cardHTML;
    }
  });

  document.querySelector("#column-todo .tasks-count-badge").textContent =
    taskManager.getTasksWithStatus("To Do").length;
  document.querySelector("#column-inprogress .tasks-count-badge").textContent =
    taskManager.getTasksWithStatus("In Progress").length;
  document.querySelector("#column-done .tasks-count-badge").textContent =
    taskManager.getTasksWithStatus("Done").length;

  document.querySelectorAll(".btn-delete-task").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const taskId = event.currentTarget.dataset.id;
      taskManager.deleteTask(taskId);
      renderKanbanBoard(taskManager, projectManager);
    });
  });
}
