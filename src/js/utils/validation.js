export function validateTaskForm(
  taskTitle,
  taskDescription,
  project,
  taskAssignee,
  taskDeadline,
  taskPriority,
  taskStatus,
) {
  const inputErrors = {};

  if (!taskTitle || taskTitle.trim().length <= 8) {
    inputErrors.taskTitle = "The title must be longer than 8 characters";
  }

  if (!taskDescription || taskDescription.trim().length <= 15) {
    inputErrors.taskDescription =
      "The description must be longer than 15 characters";
  }

  if (!project || project.trim() === "") {
    inputErrors.project = "Please select a project or create new one";
  }
  if (!taskAssignee || taskAssignee.trim().length <= 8) {
    inputErrors.taskAssignee =
      "The asignee's name must be longer than 8 characters";
  }

  if (!taskDeadline || taskDeadline.trim() === "") {
    inputErrors.taskDeadline = "Please select a valid due date";
  } else {
    const selectedDate = new Date(taskDeadline);
    const todayDate = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    todayDate.setHours(0, 0, 0, 0);

    if (selectedDate < todayDate) {
      inputErrors.taskDeadline = "The due date cannot be in the past";
    }
  }

  if (!taskPriority || taskPriority.trim() === "") {
    inputErrors.taskPriority = "Please select a priority level";
  }

  if (!taskStatus || taskStatus.trim() === "") {
    inputErrors.taskStatus = "Please select an initial task status";
  }

  const isInputValid = Object.keys(inputErrors).length === 0;

  const validationResult = {
    isFormValid: isInputValid,
    errors: inputErrors,
  };

  return validationResult;
}
