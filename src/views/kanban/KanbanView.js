import { createTaskCardHTML } from "./components/task-card/TaskCard.js";
import { renderProgressBar } from "./components/progress-bar/ProgressBar.js";
import { renderTaskModal } from "./components/task-modal/TaskModal.js";

export function renderKanbanView(taskManager, projectManager) {
  const todoContainer = document.getElementById("tasks-todo-container");
  const inprogressContainer = document.getElementById(
    "tasks-inprogress-container",
  );
  const doneContainer = document.getElementById("tasks-done-container");
  const inreviewContainer = document.getElementById("tasks-inreview-container");
  if (
    !todoContainer ||
    !inprogressContainer ||
    !doneContainer ||
    !inreviewContainer
  )
    return;

  todoContainer.innerHTML = "";
  inprogressContainer.innerHTML = "";
  doneContainer.innerHTML = "";
  inreviewContainer.innerHTML = "";

  const activeProjectId =
    projectManager && typeof projectManager.getActiveProject === "function"
      ? projectManager.getActiveProject()
      : "all";

  const visibleTasks =
    activeProjectId === "all"
      ? taskManager.getAllTasks()
      : taskManager.getTasksWithProject(activeProjectId);

  const emptyTaskHTML = `
    <div class="empty-state-cozy">
        <i class='bx bx-heart bx-sm' ></i>
        <p>Nothing here yet</p>
    </div>
  `;

  todoContainer.innerHTML = emptyTaskHTML;
  inprogressContainer.innerHTML = emptyTaskHTML;
  doneContainer.innerHTML = emptyTaskHTML;
  inreviewContainer.innerHTML = emptyTaskHTML;

  let todoCount = 0,
    inprogressCount = 0,
    inreviewCount = 0,
    doneCount = 0;

  visibleTasks.forEach((task) => {
    const cardHTML = createTaskCardHTML(task, projectManager);

    if (task.status === "To Do") {
      if (todoCount === 0) todoContainer.innerHTML = "";
      todoContainer.innerHTML += cardHTML;
      todoCount++;
    }
    if (task.status === "In Progress") {
      if (inprogressCount === 0) inprogressContainer.innerHTML = "";
      inprogressContainer.innerHTML += cardHTML;
      inprogressCount++;
    }
    if (task.status === "In Review") {
      if (inreviewCount === 0) inreviewContainer.innerHTML = "";
      inreviewContainer.innerHTML += cardHTML;
      inreviewCount++;
    }
    if (task.status === "Done") {
      if (doneCount === 0) doneContainer.innerHTML = "";
      doneContainer.innerHTML += cardHTML;
      doneCount++;
    }
  });

  document.querySelector("#column-todo .tasks-count-badge").textContent =
    todoCount;
  document.querySelector("#column-inprogress .tasks-count-badge").textContent =
    inprogressCount;
  document.querySelector("#column-inreview .tasks-count-badge").textContent =
    inreviewCount;
  document.querySelector("#column-done .tasks-count-badge").textContent =
    doneCount;

  renderProgressBar(taskManager, projectManager);

  document.querySelectorAll(".btn-complete-task").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const taskId = event.currentTarget.dataset.id;
      taskManager.updateTaskStatus(taskId, "Done");
      renderKanbanView(taskManager, projectManager);
    });
  });

  document.querySelectorAll(".btn-delete-task").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const taskId = event.currentTarget.dataset.id;
      taskManager.deleteTask(taskId);
      renderKanbanView(taskManager, projectManager);
    });
  });

  document.querySelectorAll(".btn-expand-subtasks").forEach((toggleBtn) => {
    toggleBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const wrapper = toggleBtn.closest(".task-subtasks-wrapper");
      if (!wrapper) return;
      const isOpen = wrapper.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".checklist-item").forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      const { taskId, subtaskId } = event.currentTarget.dataset;
      const updated = taskManager.toggleSubtask(taskId, subtaskId);
      if (updated) {
        item.classList.toggle("checked", Boolean(updated.completed));
      }
    });
  });

  document.querySelectorAll(".task-card-item").forEach((card) => {
    card.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", card.dataset.id);
      event.dataTransfer.effectAllowed = "move";
      card.classList.add("is-dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("is-dragging");
      document.querySelectorAll(".kanban-column").forEach((col) => {
        col.classList.remove("is-drag-over");
      });
    });

    card.addEventListener("click", (event) => {
      if (
        event.target.closest(".btn-complete-task") ||
        event.target.closest(".btn-delete-task") ||
        event.target.closest(".btn-expand-subtasks") ||
        event.target.closest(".checklist-item")
      ) {
        return;
      }

      const taskId = event.currentTarget.dataset.id;
      const taskToEdit = taskManager
        .getAllTasks()
        .find((task) => task.id === parseInt(taskId));

      if (taskToEdit) {
        renderTaskModal(taskManager, projectManager, taskToEdit);
      }
    });
  });

  document.querySelectorAll(".kanban-column").forEach((column) => {
    column.ondragover = (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      column.classList.add("is-drag-over");
    };

    column.ondragleave = (event) => {
      if (!column.contains(event.relatedTarget)) {
        column.classList.remove("is-drag-over");
      }
    };

    column.ondrop = (event) => {
      event.preventDefault();
      column.classList.remove("is-drag-over");

      const draggedTaskId = event.dataTransfer.getData("text/plain");
      const newStatus = column.dataset.status;

      if (draggedTaskId && newStatus) {
        taskManager.updateTaskStatus(draggedTaskId, newStatus);
        renderKanbanView(taskManager, projectManager);
      }
    };
  });
}

export const renderKanbanBoard = renderKanbanView;
