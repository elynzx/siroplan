import { validateTaskForm } from "../utils/validation.js";
import { renderKanbanBoard } from "./KanbanBoard.js";

function createTaskModalHTML(projectManager) {
  const projects = projectManager.getAllProjects();
  let projectOptionsHTML = "";

  projects.forEach((project) => {
    projectOptionsHTML += `<option value="${project.id}">${project.title}</option>`;
  });

  if (projects.length === 0) {
    projectOptionsHTML = `<option value="">No projects available</option>`;
  }

  return `
    <div class="modal-overlay">
        <article class="modal-card modal-task">
            <button type="button" id="closeTask" class="btn btn-small modal-close-btn"><i class='bx bx-x bx-sm'></i></button>
            <header class="modal-header">
                <span class="subtitle">A new little goal</span>
                <h2 class="title">Create a new task</h2>
            </header>
            <form id="formModalTask" class="modal-form">
                
                <div class="form-group">
                    <label for="task-title">Task Title</label>
                    <input type="text" id="task-title" placeholder="What would you like to do?" autocomplete="off">
                    <span class="error-message" id="error-taskTitle"></span>
                </div>
                
                <div class="form-group">
                    <label for="task-desc">Description</label>
                    <textarea id="task-desc" placeholder="Add a few details..."></textarea>
                    <span class="error-message" id="error-taskDescription"></span>
                </div>
                
                <div class="form-group">
                    <label for="task-project">Project</label>
                    <div class="select-wrapper">
                        <select id="task-project">
                            ${projectOptionsHTML}
                        </select>
                    </div>
                    <span class="error-message" id="error-project"></span>
                </div>
                
                <div class="form-col">
                    <div class="form-group form-group-col">
                        <label for="task-assignee">Assignee</label>
                        <input type="text" id="task-assignee" placeholder="Who is responsible?">
                        <span class="error-message" id="error-taskAssignee"></span>
                    </div>

                    <div class="form-group form-group-col">
                        <label for="task-date">Due Date</label>
                        <input type="date" id="task-date">
                        <span class="error-message" id="error-taskDeadline"></span>
                    </div>
                </div>

                <div class="form-col">
                    <div class="form-group form-group-col">
                        <label for="task-priority">Priority</label>
                        <div class="select-wrapper">
                            <select id="task-priority">
                                <option value="">Select Priority</option>
                                <option value="Low">Low</option>
                                <option value="Medium" selected>Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <span class="error-message" id="error-taskPriority"></span>
                    </div>

                    <div class="form-group form-group-col">
                        <label for="task-status">Initial Status</label>
                        <div class="select-wrapper">
                            <select id="task-status">
                                <option value="">Select Status</option>
                                <option value="To Do" selected>To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>
                        <span class="error-message" id="error-taskStatus"></span>
                    </div>
                </div>

                <footer class="modal-footer">
                    <button type="button" id="closeTaskCancel" class="btn btn-secondary">Maybe later</button>
                    <button type="submit" class="btn btn-primary"><i class='bx bx-plus'></i> Create Task</button>
                </footer>
            </form>
        </article>
    </div>
  `;
}

export function renderTaskModal(taskManager, projectManager) {
  const modalContainer = document.createElement("div");
  modalContainer.id = "taskModal";

  modalContainer.innerHTML = createTaskModalHTML(projectManager);
  document.body.appendChild(modalContainer);

  const closeModal = () => modalContainer.remove();

  document.getElementById("closeTask").addEventListener("click", closeModal);
  document
    .getElementById("closeTaskCancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("formModalTask")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const taskTitle = document.getElementById("task-title").value;
      const taskDescription = document.getElementById("task-desc").value;
      const project = document.getElementById("task-project").value;
      const taskAssignee = document.getElementById("task-assignee").value;
      const taskDeadline = document.getElementById("task-date").value;
      const taskPriority = document.getElementById("task-priority").value;
      const taskStatus = document.getElementById("task-status").value;

      modalContainer
        .querySelectorAll(".error-message")
        .forEach((errorMessage) => (errorMessage.textContent = ""));

      const validationResult = validateTaskForm(
        taskTitle,
        taskDescription,
        project,
        taskAssignee,
        taskDeadline,
        taskPriority,
        taskStatus,
      );

      if (!validationResult.isFormValid) {
        Object.keys(validationResult.errors).forEach((formErrorType) => {
          const errorMessage = modalContainer.querySelector(
            `#error-${formErrorType}`,
          );
          if (errorMessage) {
            errorMessage.textContent = validationResult.errors[formErrorType];
          }
        });
        return;
      }

      taskManager.addTask(
        taskTitle,
        taskDescription,
        project,
        taskAssignee,
        taskDeadline,
        taskPriority,
        taskStatus,
      );

      renderKanbanBoard(taskManager, projectManager);
      closeModal();
    });
}
