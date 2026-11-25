import { validateTaskForm } from "../../../../utils/validation.js";
import { renderKanbanView } from "../../KanbanView.js";

function createTaskModalHTML(projectManager, initialProjectId = "") {
  const projects = projectManager.getAllProjects();
  const selectedProject =
    projects.find((p) => String(p.id) === String(initialProjectId)) ||
    projects[0] ||
    null;

  const selectedValue = selectedProject ? selectedProject.id : "";
  const selectedLabel = selectedProject
    ? selectedProject.title
    : "No projects available";

  const projectMenuItemsHTML =
    projects.length > 0
      ? projects
          .map(
            (project) => `
          <button
            type="button"
            class="modal-project-option ${String(project.id) === String(selectedValue) ? "is-active" : ""}"
            data-project-id="${project.id}"
            data-project-title="${project.title.replace(/"/g, "&quot;")}"
          >
            <span class="modal-option-title">${project.title}</span>
            <i class="hn hn-check-solid modal-option-check"></i>
          </button>
        `,
          )
          .join("")
      : `<div class="modal-project-empty">Create a project first in the board</div>`;

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
                                <button
                                  type="button"
                                  id="modalProjectBtn"
                                  class="modal-project-trigger ${projects.length === 0 ? "is-disabled" : ""}"
                                  aria-expanded="false"
                                >
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

export function renderTaskModal(
  taskManager,
  projectManager,
  taskToEdit = null,
) {
  const modalContainer = document.createElement("div");
  modalContainer.id = "taskModal";

  const activeProjectId =
    projectManager && typeof projectManager.getActiveProject === "function"
      ? projectManager.getActiveProject()
      : "all";

  const initialProjectId = taskToEdit
    ? taskToEdit.project
    : activeProjectId !== "all"
      ? activeProjectId
      : "";

  modalContainer.innerHTML = createTaskModalHTML(
    projectManager,
    initialProjectId,
  );
  document.body.appendChild(modalContainer);

  const pendingSubtasks =
    taskToEdit && Array.isArray(taskToEdit.subTasks)
      ? taskToEdit.subTasks.map((st) => ({
          id: st.id || crypto.randomUUID(),
          description: st.description,
          completed: Boolean(st.completed),
        }))
      : [];

  const titleInput = document.getElementById("task-title");
  const inputSubtask = document.getElementById("inputSubtask");
  const btnAddSubtask = document.getElementById("btnAddSubtask");
  const subtasksPreviewList = document.getElementById("subtasksPreviewList");
  const subtaskCounterBadge = document.getElementById("subtaskCounterBadge");
  const priorityInput = document.getElementById("task-priority");
  const projectInput = document.getElementById("task-project");
  const modalProjectBtn = document.getElementById("modalProjectBtn");
  const modalProjectMenu = document.getElementById("modalProjectMenu");
  const modalProjectLabel = document.getElementById("modalProjectLabel");

  const setProjectSelection = (projectId) => {
    const project = projectManager.getProjectById(projectId);
    if (!project) return;
    projectInput.value = project.id;
    if (modalProjectLabel) {
      modalProjectLabel.textContent = project.title;
    }
    modalContainer
      .querySelectorAll(".modal-project-option")
      .forEach((optBtn) => {
        optBtn.classList.toggle(
          "is-active",
          String(optBtn.dataset.projectId) === String(project.id),
        );
      });
  };

  if (modalProjectBtn && modalProjectMenu) {
    modalProjectBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (modalProjectBtn.classList.contains("is-disabled")) return;
      const isOpen = modalProjectMenu.classList.toggle("is-open");
      modalProjectBtn.classList.toggle("is-open", isOpen);
      modalProjectBtn.setAttribute("aria-expanded", String(isOpen));
    });

    modalProjectMenu
      .querySelectorAll(".modal-project-option")
      .forEach((optBtn) => {
        optBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          setProjectSelection(optBtn.dataset.projectId);
          modalProjectMenu.classList.remove("is-open");
          modalProjectBtn.classList.remove("is-open");
          modalProjectBtn.setAttribute("aria-expanded", "false");
        });
      });

    modalContainer.addEventListener("click", (event) => {
      if (!event.target.closest("#modalProjectDropdown")) {
        modalProjectMenu.classList.remove("is-open");
        modalProjectBtn.classList.remove("is-open");
        modalProjectBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  const setPrioritySelection = (priorityVal) => {
    priorityInput.value = priorityVal;
    modalContainer
      .querySelectorAll("#priorityBadgesGroup .modal-choice-badge")
      .forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.priority === priorityVal);
      });
  };

  modalContainer
    .querySelectorAll("#priorityBadgesGroup .modal-choice-badge")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        setPrioritySelection(btn.dataset.priority);
      });
    });

  const renderPendingSubtasks = () => {
    if (!subtasksPreviewList) return;
    if (subtaskCounterBadge) {
      const count = pendingSubtasks.length;
      subtaskCounterBadge.textContent = `${count} ${count === 1 ? "step" : "steps"}`;
    }

    subtasksPreviewList.innerHTML = pendingSubtasks
      .map(
        (subtask, index) => `
          <div class="modal-subtask-item ${subtask.completed ? "checked" : ""}" data-index="${index}">
            <button
              type="button"
              class="subtask-checkbox modal-subtask-toggle"
              data-index="${index}"
              aria-label="Toggle subtask completion"
            >
              <i class="hn hn-check-solid"></i>
            </button>
            <input
              type="text"
              class="modal-subtask-input"
              data-index="${index}"
              value="${subtask.description.replace(/"/g, "&quot;")}"
              ${subtask.completed ? "disabled readonly" : ""}
              aria-label="Edit subtask description"
            />
            <button type="button" class="btn btn-small btn-remove-subtask" data-index="${index}" aria-label="Remove subtask">
              <i class="hn hn-times-solid"></i>
            </button>
          </div>
        `,
      )
      .join("");

    subtasksPreviewList
      .querySelectorAll(".modal-subtask-toggle")
      .forEach((toggleBtn) => {
        toggleBtn.addEventListener("click", (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          if (pendingSubtasks[idx]) {
            const isCompleted = !pendingSubtasks[idx].completed;
            pendingSubtasks[idx].completed = isCompleted;
            const itemEl = toggleBtn.closest(".modal-subtask-item");
            if (itemEl) {
              itemEl.classList.toggle("checked", isCompleted);
              const inputEl = itemEl.querySelector(".modal-subtask-input");
              if (inputEl) {
                inputEl.disabled = isCompleted;
                inputEl.readOnly = isCompleted;
                if (isCompleted) inputEl.blur();
              }
            }
          }
        });
      });

    subtasksPreviewList
      .querySelectorAll(".modal-subtask-input")
      .forEach((editInput) => {
        editInput.addEventListener("input", (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          if (!pendingSubtasks[idx] || pendingSubtasks[idx].completed) return;
          pendingSubtasks[idx].description = e.currentTarget.value;
        });

        editInput.addEventListener("blur", (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          if (!pendingSubtasks[idx] || pendingSubtasks[idx].completed) return;
          const trimmed = e.currentTarget.value.trim();
          if (!trimmed) {
            pendingSubtasks.splice(idx, 1);
            renderPendingSubtasks();
          } else {
            pendingSubtasks[idx].description = trimmed;
            e.currentTarget.value = trimmed;
          }
        });

        editInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        });
      });

    subtasksPreviewList
      .querySelectorAll(".btn-remove-subtask")
      .forEach((removeBtn) => {
        removeBtn.addEventListener("click", (e) => {
          const idx = Number(e.currentTarget.dataset.index);
          pendingSubtasks.splice(idx, 1);
          renderPendingSubtasks();
        });
      });
  };

  const handleAddSubtask = () => {
    const description = inputSubtask.value.trim();
    if (!description) return;

    pendingSubtasks.push({
      id: crypto.randomUUID(),
      description,
      completed: false,
    });
    inputSubtask.value = "";
    inputSubtask.focus();
    renderPendingSubtasks();
  };

  btnAddSubtask.addEventListener("click", handleAddSubtask);

  inputSubtask.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddSubtask();
    }
  });

  if (taskToEdit) {
    document.querySelector("#taskModal .title").textContent = "Edit Task";
    const submitBtn = document.querySelector("#formModalTask .btn-submit");
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="hn hn-check-solid"></i> Save Changes';
    }

    titleInput.value = taskToEdit.title;
    document.getElementById("task-desc").value = taskToEdit.description;
    setProjectSelection(taskToEdit.project);
    document.getElementById("task-assignee").value = taskToEdit.assignee;
    document.getElementById("task-date").value = taskToEdit.deadline;
    setPrioritySelection(taskToEdit.priority || "Medium");
  }

  renderPendingSubtasks();
  if (titleInput) titleInput.focus();

  const closeModal = () => modalContainer.remove();

  document.getElementById("closeTask").addEventListener("click", closeModal);
  document
    .getElementById("closeTaskCancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("formModalTask")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const taskTitle = titleInput.value;
      const taskDescription = document.getElementById("task-desc").value;
      const project = projectInput.value;
      const taskAssignee = document.getElementById("task-assignee").value;
      const taskDeadline = document.getElementById("task-date").value;
      const taskPriority = priorityInput.value;
      const taskStatus = taskToEdit ? taskToEdit.status || "To Do" : "To Do";

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

      if (inputSubtask.value.trim() !== "") {
        pendingSubtasks.push({
          id: crypto.randomUUID(),
          description: inputSubtask.value.trim(),
          completed: false,
        });
        inputSubtask.value = "";
      }

      const validSubtasks = pendingSubtasks
        .map((st) => ({
          id: st.id || crypto.randomUUID(),
          description: st.description.trim(),
          completed: Boolean(st.completed),
        }))
        .filter((st) => st.description !== "");

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
