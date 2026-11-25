import { TaskManager } from "./services/TaskManager.js";
import { ProjectManager } from "./services/ProjectManager.js";
import { initSplashScreen } from "./components/splash/SplashScreen.js";
import { initSidebar } from "./components/sidebar/Sidebar.js";
import { initPomodoroTimer } from "./components/pomodoro/PomodoroTimer.js";
import { renderProjectModal } from "./views/kanban/components/project-modal/ProjectModal.js";
import { renderTaskModal } from "./views/kanban/components/task-modal/TaskModal.js";
import { renderProjectTabs } from "./views/kanban/components/project-tabs/ProjectTabs.js";
import { renderKanbanView } from "./views/kanban/KanbanView.js";

document.addEventListener("DOMContentLoaded", function () {
  initSplashScreen();
  initSidebar();
  initPomodoroTimer();

  const taskManager = new TaskManager();
  const projectManager = new ProjectManager();

  projectManager.loadFromLocalStorage();
  taskManager.loadFromLocalStorage();

  const btnProject = document.getElementById("btnProject");
  const btnTask = document.getElementById("btnTask");
  const btnTaskMobile = document.getElementById("btnTaskMobile");

  const openNewTaskModal = () => renderTaskModal(taskManager, projectManager);
  const refreshKanban = () => renderKanbanView(taskManager, projectManager);

  if (btnProject) {
    btnProject.addEventListener("click", () =>
      renderProjectModal(projectManager),
    );
  }

  if (btnTask) {
    btnTask.addEventListener("click", openNewTaskModal);
  }

  if (btnTaskMobile) {
    btnTaskMobile.addEventListener("click", openNewTaskModal);
  }

  renderProjectTabs(projectManager, refreshKanban);
  refreshKanban();
});
