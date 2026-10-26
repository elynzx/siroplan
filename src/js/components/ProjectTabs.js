export function renderProjectTabs(projectManager) {
  const tabsContainer = document.querySelector(".tabs-wrapper");
  if (!tabsContainer) return;

  const allProjects = projectManager.getAllProjects();

  let tabsHTML = `<button class="tab-btn active" data-project-id="all">All Projects</button>`;

  allProjects.forEach((project) => {
    tabsHTML += `
      <button class="tab-btn" data-project-id="${project.id}">
        ${project.title}
      </button>
    `;
  });

  tabsContainer.innerHTML = tabsHTML;
}
