import { TaskManager } from "./services/TaskManager.js";
import { ProjectManager } from "./services/ProjectManager.js";
import { renderProjectModal } from "./components/ProjectModal.js";
import { renderProjectTabs } from "./components/ProjectTabs.js";
import { renderTaskModal } from "./components/TaskModal.js";
import { renderKanbanBoard } from "./components/KanbanBoard.js";

document.addEventListener("DOMContentLoaded", function () {
  const taskManager = new TaskManager();
  const projectManager = new ProjectManager();

  projectManager.loadFromLocalStorage();
  taskManager.loadFromLocalStorage();

  const btnProject = document.getElementById("btnProject");
  const btnTask = document.getElementById("btnTask");

  if (btnProject)
    btnProject.addEventListener("click", () =>
      renderProjectModal(projectManager),
    );

  if (btnTask)
    btnTask.addEventListener("click", () =>
      renderTaskModal(taskManager, projectManager),
    );

  renderProjectTabs(projectManager);
  renderKanbanBoard(taskManager, projectManager);
});
