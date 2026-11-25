import { formatDate } from "../../../../utils/formatter.js";

export function createTaskCardHTML(task, projectManager) {
  const formattedDate = formatDate(task.deadline);

  const project = projectManager.getProjectById(task.project);
  const projectName = project ? project.title : "No Name";

  const subTasks = Array.isArray(task.subTasks) ? task.subTasks : [];

  const checklistHTML =
    subTasks.length > 0
      ? `
        <div class="task-subtasks-wrapper">
          <button
            type="button"
            class="btn-ghost btn-expand-subtasks"
            aria-expanded="false"
            aria-label="Toggle subtasks"
          >
            <span>Steps</span>
            <i class="hn hn-angle-down-solid expand-icon"></i>
          </button>
          <div class="checklist-container">
            ${subTasks
              .map(
                (subtask) => `
                <div class="checklist-item ${subtask.completed ? "checked" : ""}" data-task-id="${task.id}" data-subtask-id="${subtask.id}">
                  <span class="subtask-checkbox">
                    <i class="hn hn-check-solid"></i>
                  </span>
                  <span class="subtask-label">${subtask.description}</span>
                </div>
              `,
              )
              .join("")}
          </div>
        </div>
      `
      : "";

  return `
    <article class="task-card-item" data-id="${task.id}" draggable="true">
      <header class="card-item-header">
        <span class="project-label tag-blue">${projectName}</span>
        <button
          type="button"
          class="btn btn-small btn-complete-task"
          data-id="${task.id}"
          title="Mark as Done"
          aria-label="Complete Task"
        >
          <i class="hn hn-check-solid"></i>
        </button>
      </header>

      <div class="card-item-body">
        <h4 class="task-card-title">${task.title}</h4>
        <p class="task-card-description">${task.description}</p>
        ${checklistHTML}
      </div>

      <footer class="card-footer">
        <div class="footer-left">
          <span class="user-avatar">MP</span>
          <span class="priority-badge badge-${task.priority.toLowerCase()}">
            <i class="hn hn-flag-solid"></i>${task.priority}
          </span>
        </div>
        <div class="footer-right">
          <span class="date-text">
            <i class="hn hn-calendar-solid"></i> ${formattedDate}
          </span>

          <button
            type="button"
            class="btn btn-small btn-delete-task"
            data-id="${task.id}"
            title="Delete Task"
            aria-label="Delete Task"
          >
            <i class="hn hn-trash-alt-solid"></i>
          </button>
        </div>
      </footer>
    </article>
  `;
}
