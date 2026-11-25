import { renderProjectTabs } from "../project-tabs/ProjectTabs.js";

function createProjectModalHTML() {
  return `
    <div class="modal-overlay">
      <article class="modal-card modal-project">
        <button
          type="button"
          id="closeProject"
          class="btn btn-small modal-close-btn"
          aria-label="Close modal"
        >
          <i class="hn hn-times-solid"></i>
        </button>
        <header class="modal-header">
          <h2 class="title">Create a new project</h2>
          <p class="subtitle">Give your next lovely idea a little home.</p>
        </header>
        <form id="formModalProject" class="modal-form">
          <div class="form-group">
            <label for="project-name">Project Name</label>
            <input
              type="text"
              id="project-name"
              placeholder="Web app project"
              required
              autocomplete="off"
            />
          </div>
          <footer class="modal-footer">
            <button
              type="button"
              id="closeProjectCancel"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-submit">
              <i class="hn hn-plus-solid"></i> Create Project
            </button>
          </footer>
        </form>
      </article>
    </div>
  `;
}

export function renderProjectModal(projectManager, projectToEdit = null) {
  const modalContainer = document.createElement("div");
  modalContainer.id = "projectModal";

  modalContainer.innerHTML = createProjectModalHTML();
  document.body.appendChild(modalContainer);

  const projectInput = document.getElementById("project-name");

  if (projectToEdit) {
    document.querySelector("#projectModal .title").textContent = "Edit project";
    document.querySelector("#projectModal .subtitle").textContent =
      "Update your project's name.";
    const submitBtn = document.querySelector("#formModalProject .btn-submit");
    if (submitBtn) {
      submitBtn.innerHTML = '<i class="hn hn-check-solid"></i> Save Changes';
    }
    projectInput.value = projectToEdit.title;
  }

  projectInput.focus();

  const closeModal = () => modalContainer.remove();

  document.getElementById("closeProject").addEventListener("click", closeModal);
  document
    .getElementById("closeProjectCancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("formModalProject")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const projectName = projectInput.value.trim();
      if (!projectName) return;

      if (projectToEdit) {
        projectManager.updateProject(projectToEdit.id, projectName);
      } else {
        projectManager.addProject(projectName);
      }

      renderProjectTabs(projectManager);
      if (typeof projectManager._onSelectProject === "function") {
        projectManager._onSelectProject(projectManager.getActiveProject());
      }

      closeModal();
    });
}
