import { renderProjectModal } from "./components/ProjectModal.js";
import { renderTaskModal } from "./components/TaskModal.js";

document.addEventListener("DOMContentLoaded", function () {
  const btnProject = document.getElementById("btnProject");
  const btnTask = document.getElementById("btnTask");

  if (btnProject) {
    btnProject.addEventListener("click", renderProjectModal);
  }

  if (btnTask) {
    btnTask.addEventListener("click", renderTaskModal);
  }
});
