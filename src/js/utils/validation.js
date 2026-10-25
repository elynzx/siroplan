export function validateTaskForm(
  taskTitle,
  taskDescription,
  project,
  taskAssignee,
  taskDeadline,
  taskPriority,
) {
  let isValid = true;
  const inputErrors = {};

  if (!taskTitle || taskTitle.trim().length <= 8) {
    inputErrors.taskTitle = "The title must be longer than 8 characters";
    isValid = false;
  }

  if (!taskDescription || taskDescription.trim().length <= 15) {
    inputErrors.taskDescription =
      "The description must be longer than 15 characters";
    isValid = false;
  }

  if (!project || project.trim() === "") {
    inputErrors.project = "Please select a project or create new one";
    isValid = false;
  }
  if (!taskAssignee || taskAssignee.trim().length <= 8) {
    inputErrors.taskAssignee =
      "The asignee's name must be longer than 8 characters";
    isValid = false;
  }

  if (!taskDeadline || taskDeadline.trim() === "") {
    inputErrors.taskDeadline = "Please select a valid due date";
    isValid = false;
  }

  if (!taskPriority || taskPriority.trim() === "") {
    inputErrors.taskPriority = "Please select a priority level";
    isValid = false;
  }

  const validationResult = {
    isFormValid: isValid,
    errors: inputErrors,
  };

  return validationResult;
}
