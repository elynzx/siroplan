import { renderProjectModal } from "../project-modal/ProjectModal.js";

export function renderProjectTabs(projectManager, onSelectProject = null) {
  const tabsContainer = document.querySelector(".tabs-wrapper");
  if (!tabsContainer) return;

  if (onSelectProject) {
    projectManager._onSelectProject = onSelectProject;
  }

  const allProjects = projectManager.getAllProjects();
  const activeId = projectManager.getActiveProject
    ? projectManager.getActiveProject()
    : "all";
  const activeProject =
    activeId !== "all" ? projectManager.getProjectById(activeId) : null;

  let tabsHTML = `
    <button class="tab-btn tab-btn-all ${activeId === "all" ? "active" : ""}" data-project-id="all">
      <span class="tab-all-desktop">All Projects</span>
      <span class="tab-all-mobile">All</span>
    </button>
  `;

  allProjects.forEach((project) => {
    const isActive = String(activeId) === String(project.id);
    tabsHTML += `
      <button class="tab-btn tab-btn-item ${isActive ? "active" : ""}" data-project-id="${project.id}" title="Double click to edit project">
        <span class="tab-title">${project.title}</span>
      </button>
    `;
  });

  const mobileTabLabel = activeProject ? activeProject.title : "Select Project";
  const mobileMenuItemsHTML =
    allProjects.length > 0
      ? allProjects
          .map(
            (project) => `
          <div class="mobile-project-option ${String(activeId) === String(project.id) ? "is-active" : ""}" data-project-id="${project.id}">
            <span class="mobile-option-title">${project.title}</span>
            <button type="button" class="btn btn-small mobile-option-edit" data-edit-id="${project.id}" aria-label="Edit project">
              <i class='bx bxs-pencil'></i>
            </button>
          </div>
        `,
          )
          .join("")
      : `<div class="mobile-project-empty">No projects yet</div>`;

  tabsHTML += `
    <div class="mobile-project-tab-wrapper">
      <button
        type="button"
        id="mobileProjectTabBtn"
        class="tab-btn tab-btn-dropdown ${activeId !== "all" ? "active" : ""}"
        aria-expanded="false"
      >
        <span class="tab-title">${mobileTabLabel}</span>
        <i class="hn hn-angle-down-solid dropdown-chevron"></i>
      </button>
      <div id="mobileProjectMenu" class="mobile-project-menu">
        ${mobileMenuItemsHTML}
        <button type="button" id="mobileAddProjectOption" class="mobile-project-add-option">
          <i class="hn hn-plus-solid"></i>
          <span>New Project</span>
        </button>
      </div>
    </div>
  `;

  tabsContainer.innerHTML = tabsHTML;

  const selectProject = (selectedId) => {
    if (projectManager.setActiveProject) {
      projectManager.setActiveProject(selectedId);
    }
    renderProjectTabs(projectManager);
    if (typeof projectManager._onSelectProject === "function") {
      projectManager._onSelectProject(selectedId);
    }
  };

  tabsContainer
    .querySelectorAll(".tab-btn-all, .tab-btn-item")
    .forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        selectProject(tabBtn.dataset.projectId);
      });

      tabBtn.addEventListener("dblclick", () => {
        const selectedId = tabBtn.dataset.projectId;
        if (selectedId === "all") return;
        const project = projectManager.getProjectById(selectedId);
        if (project) {
          renderProjectModal(projectManager, project);
        }
      });
    });

  const mobileTabBtn = tabsContainer.querySelector("#mobileProjectTabBtn");
  const mobileMenu = tabsContainer.querySelector("#mobileProjectMenu");

  if (mobileTabBtn && mobileMenu) {
    mobileTabBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = mobileMenu.classList.toggle("is-open");
      mobileTabBtn.classList.toggle("is-open", isOpen);
      mobileTabBtn.setAttribute("aria-expanded", String(isOpen));
    });

    mobileMenu.querySelectorAll(".mobile-project-option").forEach((opt) => {
      opt.addEventListener("click", (event) => {
        const editBtn = event.target.closest(".mobile-option-edit");
        if (editBtn) {
          event.stopPropagation();
          mobileMenu.classList.remove("is-open");
          mobileTabBtn.classList.remove("is-open");
          const project = projectManager.getProjectById(editBtn.dataset.editId);
          if (project) {
            renderProjectModal(projectManager, project);
          }
          return;
        }

        selectProject(opt.dataset.projectId);
      });
    });

    const mobileAddBtn = mobileMenu.querySelector("#mobileAddProjectOption");
    if (mobileAddBtn) {
      mobileAddBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        mobileMenu.classList.remove("is-open");
        mobileTabBtn.classList.remove("is-open");
        mobileTabBtn.setAttribute("aria-expanded", "false");
        renderProjectModal(projectManager);
      });
    }

    document.addEventListener(
      "click",
      (event) => {
        if (!event.target.closest(".mobile-project-tab-wrapper")) {
          mobileMenu.classList.remove("is-open");
          mobileTabBtn.classList.remove("is-open");
          mobileTabBtn.setAttribute("aria-expanded", "false");
        }
      },
      { once: true },
    );
  }
}
