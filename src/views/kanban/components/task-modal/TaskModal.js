import { validateTaskForm } from "../../../../utils/validation.js";
import { renderKanbanView } from "../../KanbanView.js";
import {
  initProjectDropdown,
  setSelectedProject,
} from "./components/ProjectDropdown.js";
import {
  initPriorityBadges,
  setSelectedPriority,
} from "./components/PriorityBadges.js";
import { initSubtaskChecklist } from "./components/SubtaskChecklist.js";

function createTaskModalHTML(projectManager, initialProjectId = "") {
  const projects = projectManager.getAllProjects();

  // Find initial project
  let selectedProject = projects.find(
    (project) => String(project.id) === String(initialProjectId),
  );
  if (!selectedProject && projects.length > 0) {
    selectedProject = projects[0];
  }

  let selectedValue = "";
  let selectedLabel = "No projects available";

  if (selectedProject) {
    selectedValue = selectedProject.id;
    selectedLabel = selectedProject.title;
  }

  let projectMenuItemsHTML = "";
  if (projects.length > 0) {
    projectMenuItemsHTML = projects
      .map((project) => {
        const isActive =
          String(project.id) === String(selectedValue) ? "is-active" : "";
        return `
          <button
            type="button"
            class="modal-project-option ${isActive}"
            data-project-id="${project.id}"
          >
            <span class="modal-option-title">${project.title}</span>
            <i class="hn hn-check-solid modal-option-check"></i>
          </button>
        `;
      })
      .join("");
  } else {
    projectMenuItemsHTML = `<div class="modal-project-empty">Create a project first in the board</div>`;
  }

  const disabledClass = projects.length === 0 ? "is-disabled" : "";

  return `
    <div class="modal-overlay">
        <article class="modal-card modal-task">
            <button type="button" id="closeTask" class="btn btn-small modal-close-btn" aria-label="Close modal">
                <i class="hn hn-times-solid"></i>
            </button>
            <header class="modal-header">
                <span class="subtitle">A new little goal</span>
                <h2 class="title">Create a new task</h2>
            </header>
            <form id="formModalTask" class="modal-form">
                <div class="modal-task-grid">
                    <div class="modal-col-main">
                        <div class="form-group">
                            <label for="task-title">Task Title</label>
                            <input type="text" id="task-title" placeholder="What would you like to accomplish?" autocomplete="off">
                            <span class="error-message" id="error-taskTitle"></span>
                        </div>
                        
                        <div class="form-group">
                            <label for="task-desc">Description</label>
                            <textarea id="task-desc" rows="3" placeholder="Add a few helpful notes or details..."></textarea>
                            <span class="error-message" id="error-taskDescription"></span>
                        </div>

                        <div class="form-group form-group-subtasks">
                            <label for="inputSubtask">
                                <span>Subtasks (Checklist)</span>
                                <span id="subtaskCounterBadge" class="subtask-counter-badge">0 steps</span>
                            </label>
                            <div class="checklist-input-wrapper">
                                <input type="text" id="inputSubtask" placeholder="Write a step and press Enter or +" autocomplete="off">
                                <button type="button" id="btnAddSubtask" class="btn btn-small btn-add-step" aria-label="Add subtask">
                                    <i class="hn hn-plus-solid"></i>
                                </button>
                            </div>
                            <div id="subtasksPreviewList" class="modal-subtasks-list"></div>
                        </div>
                    </div>

                    <div class="modal-col-details">
                        <div class="details-panel-header">
                            <span class="details-panel-tag">Task Details</span>
                        </div>

                        <div class="form-group">
                            <label>Project</label>
                            <input type="hidden" id="task-project" value="${selectedValue}">
                            <div class="modal-project-dropdown" id="modalProjectDropdown">
                                <button type="button" id="modalProjectBtn" class="modal-project-trigger ${disabledClass}">
                                    <span id="modalProjectLabel" class="modal-project-label">${selectedLabel}</span>
                                    <i class="hn hn-angle-down-solid dropdown-chevron"></i>
                                </button>
                                <div id="modalProjectMenu" class="modal-project-menu">
                                    ${projectMenuItemsHTML}
                                </div>
                            </div>
                            <span class="error-message" id="error-project"></span>
                        </div>

                        <div class="form-group">
                            <label>Priority</label>
                            <input type="hidden" id="task-priority" value="Medium">
                            <div class="modal-badge-group" id="priorityBadgesGroup">
                                <button type="button" class="modal-choice-badge priority-choice-low" data-priority="Low">
                                    <i class="hn hn-flag-solid"></i> Low
                                </button>
                                <button type="button" class="modal-choice-badge priority-choice-medium active" data-priority="Medium">
                                    <i class="hn hn-flag-solid"></i> Medium
                                </button>
                                <button type="button" class="modal-choice-badge priority-choice-high" data-priority="High">
                                    <i class="hn hn-flag-solid"></i> High
                                </button>
                            </div>
                            <span class="error-message" id="error-taskPriority"></span>
                        </div>

                        <div class="form-group">
                            <label for="task-assignee">Assignee</label>
                            <input type="text" id="task-assignee" placeholder="Who is responsible?" autocomplete="off">
                            <span class="error-message" id="error-taskAssignee"></span>
                        </div>

                        <div class="form-group">
                            <label for="task-date">Due Date</label>
                            <input type="date" id="task-date">
                            <span class="error-message" id="error-taskDeadline"></span>
                        </div>
                    </div>
                </div>

                <footer class="modal-footer">
                    <button type="button" id="closeTaskCancel" class="btn btn-secondary">Maybe later</button>
                    <button type="submit" class="btn btn-primary btn-submit">
                        <i class="hn hn-plus-solid"></i> Create Task
                    </button>
                </footer>
            </form>
        </article>
    </div>
  `;
}

/**
 * Creates, populates, and attaches event listeners to the Task Modal for creation or editing.
 *
 * @param {Object} taskManager - The TaskManager instance.
 * @param {Object} projectManager - The ProjectManager instance.
 * @param {Object|null} [taskToEdit=null] - The optional task object to populate when editing.
 * @returns {void}
 */
export function renderTaskModal(
  taskManager,
  projectManager,
  taskToEdit = null,
) {
  const modalContainer = document.createElement("div");
  modalContainer.id = "taskModal";

  // Determine initial project selection
  const activeProjectId = projectManager.getActiveProject();
  let initialProjectId = "";

  if (taskToEdit) {
    initialProjectId = taskToEdit.project;
  } else if (activeProjectId !== "all") {
    initialProjectId = activeProjectId;
  }

  modalContainer.innerHTML = createTaskModalHTML(
    projectManager,
    initialProjectId,
  );
  document.body.appendChild(modalContainer);

  // Initialize submodules
  initProjectDropdown(modalContainer, projectManager);
  initPriorityBadges(modalContainer);

  const existingSubtasks =
    taskToEdit && taskToEdit.subTasks ? taskToEdit.subTasks : [];
  const getFinalSubtasks = initSubtaskChecklist(
    modalContainer,
    existingSubtasks,
  );

  // Input references
  const titleInput = document.getElementById("task-title");
  const descInput = document.getElementById("task-desc");
  const assigneeInput = document.getElementById("task-assignee");
  const dateInput = document.getElementById("task-date");
  const projectInput = document.getElementById("task-project");
  const priorityInput = document.getElementById("task-priority");

  // Populate data if editing an existing task
  if (taskToEdit) {
    const modalTitle = document.querySelector("#taskModal .title");
    if (modalTitle) {
      modalTitle.textContent = "Edit Task";
    }

    const submitBtn = document.querySelector("#formModalTask .btn-submit");
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="hn hn-check-solid"></i> Save Changes';
    }

    titleInput.value = taskToEdit.title;
    descInput.value = taskToEdit.description;
    assigneeInput.value = taskToEdit.assignee;
    dateInput.value = taskToEdit.deadline;

    setSelectedProject(modalContainer, projectManager, taskToEdit.project);
    setSelectedPriority(modalContainer, taskToEdit.priority || "Medium");
  }

  if (titleInput) {
    titleInput.focus();
  }

  const closeModal = () => modalContainer.remove();

  document.getElementById("closeTask").addEventListener("click", closeModal);
  document
    .getElementById("closeTaskCancel")
    .addEventListener("click", closeModal);

  // Handle form submission
  document
    .getElementById("formModalTask")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const taskTitle = titleInput.value;
      const taskDescription = descInput.value;
      const project = projectInput.value;
      const taskAssignee = assigneeInput.value;
      const taskDeadline = dateInput.value;
      const taskPriority = priorityInput.value;

      let taskStatus = "To Do";
      if (taskToEdit && taskToEdit.status) {
        taskStatus = taskToEdit.status;
      }

      // Clear previous error messages
      modalContainer.querySelectorAll(".error-message").forEach((err) => {
        err.textContent = "";
      });

      // Validate form inputs
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

      const validSubtasks = getFinalSubtasks();

      if (taskToEdit) {
        taskManager.updateTaskData(
          taskToEdit.id,
          taskTitle,
          taskDescription,
          project,
          taskAssignee,
          taskDeadline,
          taskPriority,
          taskStatus,
          validSubtasks,
        );
      } else {
        taskManager.addTask(
          taskTitle,
          taskDescription,
          project,
          taskAssignee,
          taskDeadline,
          taskPriority,
          taskStatus,
          validSubtasks,
        );
      }

      renderKanbanView(taskManager, projectManager);
      closeModal();
    });
}
