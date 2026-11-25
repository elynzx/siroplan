export function renderProgressBar(taskManager, projectManager) {
  const progressText = document.querySelector(".progress-text");
  const progressFill = document.querySelector(".progress-bar-fill");
  const progressLabel = document.querySelector(".progress-label");
  if (!progressText || !progressFill) return;

  const activeProjectId =
    projectManager && typeof projectManager.getActiveProject === "function"
      ? projectManager.getActiveProject()
      : "all";

  const tasks =
    activeProjectId === "all"
      ? taskManager.getAllTasks()
      : taskManager.getTasksWithProject(activeProjectId);

  const totalCount = tasks.length;
  const doneCount = tasks.filter(
    (task) => String(task.status || "").toLowerCase() === "done",
  ).length;
  const percentage =
    totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  progressText.textContent = `${doneCount}/${totalCount} tasks done`;
  progressFill.style.width = `${percentage}%`;

  if (progressLabel) {
    if (totalCount === 0) {
      progressLabel.textContent = "Let's add our first little goal!";
    } else if (percentage === 100) {
      progressLabel.textContent = "Purr-fect! All tasks done!";
    } else if (percentage >= 50) {
      progressLabel.textContent = "Keep it up! Almost there!";
    } else {
      progressLabel.textContent = "Keep it up! You got this!";
    }
  }
}
