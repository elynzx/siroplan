import { Task } from "../models/Task.js";

export class TaskManager {
  constructor() {
    this.taskList = [];
    this.taskId = 0;
  }

  addTask(title, description, project, assignee, deadline, priority, status) {
    const newTask = new Task(
      this.taskId,
      title,
      description,
      project,
      assignee,
      deadline,
      priority,
      status,
    );

    this.taskList.push(newTask);
    this.taskId++;
    return newTask;
  }

  getAllTasks() {
    return this.taskList;
  }

  getTasksWithStatus(status) {
    return this.taskList.filter((task) => task.status === status);
  }

  deleteTask(taskId) {
    this.taskList = this.taskList.filter(
      (task) => task.id !== parseInt(taskId),
    );
  }

  updateTask(taskId, status) {
    const task = this.taskList.find((task) => task.id === parseInt(taskId));
    if (task) {
      task.estado = status;
    }
  }

  assignTask(taskId, assignee) {
    const task = this.taskList.find((task) => task.id === parseInt(taskId));
    if (task) {
      task.assignee = assignee;
    }
  }

  getTasksWithProject(project) {
    return this.taskList.filter((task) => task.project === project);
  }

  updateTaskData(
    taskId,
    newTitle,
    newDescription,
    newProject,
    newAssignee,
    newDeadline,
    newPriority,
    newStatus,
  ) {
    const task = this.taskList.find((task) => task.id === parseInt(taskId));

    if (task) {
      task.title = newTitle;
      task.description = newDescription;
      task.project = newProject;
      task.assignee = newAssignee;
      task.deadline = newDeadline;
      task.priority = newPriority;
      task.status = newStatus;
    }
  }
}
