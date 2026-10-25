export function renderProjectModal() {
  const modalContainer = document.createElement("div");
  modalContainer.id = "projectModalRoot";

  modalContainer.innerHTML = `
        <div class="modal-overlay">
            <article class="modal-card">
                <button type="button" id="closeProject" class="btn btn-small modal-close-btn"><i class='bx bx-x bx-sm'></i></button>
                <header class="modal-header">
                    <h2 class="title">Create a new project</h2>
                    <p class="subtitle">Give your next lovely idea a little home.</p>
                </header>
                <form id="formModalProject" class="modal-form">
                    <div class="form-group">
                        <label for="project-name">Project Name</label>
                        <input type="text" id="project-name" placeholder="e.g. Mobile App Design" required autocomplete="off">
                    </div>
                    <footer class="modal-footer">
                        <button type="button" id="closeProjectCancel" class="btn btn-secondary">Cancel</button>
                        <button type="submit" class="btn btn-primary">+ Create Project</button>
                    </footer>
                </form>
            </article>
        </div>
    `;

  document.body.appendChild(modalContainer);

  function closeModal() {
    modalContainer.remove();
  }

  document.getElementById("closeProject").addEventListener("click", closeModal);
  document
    .getElementById("closeProjectCancel")
    .addEventListener("click", closeModal);

  document
    .getElementById("formModalProject")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const projectName = document.getElementById("project-name").value;

      console.log("Nuevo proyecto:", projectName);

      closeModal();
    });
}
