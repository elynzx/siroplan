export function initProjectDropdown(modalContainer, projectManager) {
  const projectInput = modalContainer.querySelector("#task-project");
  const modalProjectBtn = modalContainer.querySelector("#modalProjectBtn");
  const modalProjectMenu = modalContainer.querySelector("#modalProjectMenu");

  if (!modalProjectBtn || !modalProjectMenu) return;

  // Toggle dropdown visibility
  modalProjectBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    modalProjectMenu.classList.toggle("is-open");
  });

  // Handle option selection
  const options = modalProjectMenu.querySelectorAll(".modal-project-option");
  options.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      setSelectedProject(modalContainer, projectManager, opt.dataset.projectId);
      modalProjectMenu.classList.remove("is-open");
    });
  });

  document.addEventListener("click", () => {
    modalProjectMenu.classList.remove("is-open");
  });
}


/**
 * Updates the selected project when editing a task
 *
 * @param {HTMLElement} modalContainer - The parent DOM element of the modal.
 * @param {Object} projectManager - The ProjectManager instance.
 * @param {string|number} projectId - The ID of the project to select.
 * @returns {void}
 */
export function setSelectedProject(modalContainer, projectManager, projectId) {
  const project = projectManager.getProjectById(projectId);
  if (!project) return;

  const projectInput = modalContainer.querySelector("#task-project");
  const modalProjectLabel = modalContainer.querySelector("#modalProjectLabel");

  if (projectInput) projectInput.value = project.id;
  if (modalProjectLabel) modalProjectLabel.textContent = project.title;

  modalContainer.querySelectorAll(".modal-project-option").forEach((btn) => {
    btn.classList.toggle("is-active", String(btn.dataset.projectId) === String(project.id));
  });
}