import { formatDate } from "../utils/formatter.js";

export function createTaskCardHTML(task, projectManager) {
  const formattedDate = formatDate(task.deadline);

  const project = projectManager.getProjectById(task.project);
  const projectName = project ? project.title : "No Name";

  return `
    <article class="task-card-item" data-id="${task.id}">
      <header class="card-item-header">
        <span class="project-label tag-blue">${projectName}</span>
        <button class="btn-card-options" aria-label="Task options">
          <i class='bx bx-dots-horizontal-rounded bx-sm'></i>
        </button>
      </header>

      <div class="card-item-body">
        <h4 class="task-card-title">${task.title}</h4>
        <p class="task-card-description">${task.description}</p>
      </div>

      <footer class="card-footer">
        <div class="footer-left">
          <span class="user-avatar">MP</span>
          <span class="priority-badge badge-${task.priority.toLowerCase()}">
            <i class='bx bxs-flag-alt'></i>${task.priority}
          </span>
        </div>
        <div class="footer-right">
          <span class="date-text">
            <i class='bx bx-calendar-heart bx-xs'></i> ${formattedDate}
          </span>

          <button class="btn  btn-small btn-delete-task" data-id="${task.id}">
            <i class='bx bx-trash-alt bx-xs' ></i>
          </button>

        </div>
      </footer>
    </article>
  `;
}
