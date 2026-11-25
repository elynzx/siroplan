import { renderProjectModal } from "../project-modal/ProjectModal.js";

/**
 * Renders the project navigation tabs, mobile dropdown and manages click/edit events.
 *
 * @param {Object} projectManager - The ProjectManager instance.
 * @param {Function|null} [onSelectProject=null] - Optional callback function invoked when a project tab is selected.
 * @returns {void}
 */
export function renderProjectTabs(projectManager, onSelectProject = null) {
  const tabsContainer = document.querySelector(".tabs-wrapper");
  if (!tabsContainer) return;

  const allProjects = projectManager.getAllProjects();
  const activeId = projectManager.getActiveProject();

  let activeProject = null;
  if (activeId !== "all") {
    activeProject = projectManager.getProjectById(activeId);
  }

  // Build Desktop Tabs HTML
  let allTabActiveClass = "";
  if (activeId === "all") {
    allTabActiveClass = "active";
  }

  let tabsHTML = `
    <button class="tab-btn tab-btn-all ${allTabActiveClass}" data-project-id="all">
      <span class="tab-all-desktop">All Projects</span>
      <span class="tab-all-mobile">All</span>
    </button>
  `;

  allProjects.forEach((project) => {
    let itemActiveClass = "";
    if (String(activeId) === String(project.id)) {
      itemActiveClass = "active";
    }

    tabsHTML += `
      <button class="tab-btn tab-btn-item ${itemActiveClass}" data-project-id="${project.id}" title="Double click to edit project">
        <span class="tab-title">${project.title}</span>
      </button>
    `;
  });

  // Build mobile dropdown Menu HTML
  let mobileTabLabel = "Select Project";
  if (activeProject) {
    mobileTabLabel = activeProject.title;
  }

  let mobileMenuItemsHTML = "";
  if (allProjects.length > 0) {
    allProjects.forEach((project) => {
      let optionActiveClass = "";
      if (String(activeId) === String(project.id)) {
        optionActiveClass = "is-active";
      }

      mobileMenuItemsHTML += `
        <div class="mobile-project-option ${optionActiveClass}" data-project-id="${project.id}">
          <span class="mobile-option-title">${project.title}</span>
          <button type="button" class="btn btn-small mobile-option-edit" data-edit-id="${project.id}" aria-label="Edit project">
            <i class='bx bxs-pencil'></i>
          </button>
        </div>
      `;
    });
  } else {
    mobileMenuItemsHTML = `<div class="mobile-project-empty">No projects yet</div>`;
  }

  let mobileDropdownActiveClass = "";
  if (activeId !== "all") {
    mobileDropdownActiveClass = "active";
  }

  tabsHTML += `
    <div class="mobile-project-tab-wrapper">
      <button
        type="button"
        id="mobileProjectTabBtn"
        class="tab-btn tab-btn-dropdown ${mobileDropdownActiveClass}"
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

  // Selection Helper Function
  const selectProject = (selectedId) => {
    projectManager.setActiveProject(selectedId);
    renderProjectTabs(projectManager, onSelectProject);

    if (typeof onSelectProject === "function") {
      onSelectProject(selectedId);
    }
  };

  // Listeners for Desktop Tabs
  const desktopTabs = tabsContainer.querySelectorAll(
    ".tab-btn-all, .tab-btn-item",
  );
  desktopTabs.forEach((tabBtn) => {
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

  // Listeners for Mobile Dropdown Menu
  const mobileTabBtn = tabsContainer.querySelector("#mobileProjectTabBtn");
  const mobileMenu = tabsContainer.querySelector("#mobileProjectMenu");

  if (mobileTabBtn && mobileMenu) {
    mobileTabBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = mobileMenu.classList.toggle("is-open");
      mobileTabBtn.classList.toggle("is-open", isOpen);
      mobileTabBtn.setAttribute("aria-expanded", String(isOpen));
    });

    const mobileOptions = mobileMenu.querySelectorAll(".mobile-project-option");
    mobileOptions.forEach((opt) => {
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

    document.addEventListener("click", (event) => {
      if (!event.target.closest(".mobile-project-tab-wrapper")) {
        mobileMenu.classList.remove("is-open");
        mobileTabBtn.classList.remove("is-open");
        mobileTabBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
}
