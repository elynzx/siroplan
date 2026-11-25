/**
 * Calculates task progress for the current project (or all projects) and updates
 * the progress bar UI elements, including fill percentage, text counter, and dynamic label.
 *
 * @param {Object} taskManager - The TaskManager instance.
 * @param {Object} projectManager - The ProjectManager instance.
 * @returns {void}
 */
export function renderProgressBar(taskManager, projectManager) {
  const progressText = document.querySelector(".progress-text");
  const progressFill = document.querySelector(".progress-bar-fill");
  const progressLabel = document.querySelector(".progress-label");

  if (!progressText || !progressFill) return;

  const activeProjectId = projectManager.getActiveProject();

  // Filter tasks based on the active project
  let tasks = [];
  if (activeProjectId === "all") {
    tasks = taskManager.getAllTasks();
  } else {
    tasks = taskManager.getTasksWithProject(activeProjectId);
  }

  // Calculate completed tasks and progress percentage
  const totalCount = tasks.length;
  const doneTasks = tasks.filter((task) => {
    let taskStatus = "";
    if (task.status) {
      taskStatus = task.status.toLowerCase();
    }
    return taskStatus === "done";
  });
  const doneCount = doneTasks.length;

  let percentage = 0;
  if (totalCount > 0) {
    percentage = Math.round((doneCount / totalCount) * 100);
  }

  progressText.textContent = `${doneCount}/${totalCount} tasks done`;
  progressFill.style.width = `${percentage}%`;

  // Update dynamic messages
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
