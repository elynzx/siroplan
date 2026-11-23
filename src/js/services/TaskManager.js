import { Task } from "../models/Task.js";

export class TaskManager {
  constructor() {
    this.taskList = [];
    this.taskId = 1;
  }

  addTask(
    title,
    description,
    projectId,
    assignee,
    deadline,
    priority,
    status,
    subTasks,
    updatedAt,
  ) {
    const newTask = new Task(
      this.taskId,
      title,
      description,
      projectId,
      assignee,
      deadline,
      priority,
      status,
      subTasks,
      updatedAt,
    );

    this.taskList.push(newTask);
    this.taskId++;
    this.saveToLocalStorage();
    return newTask;
  }

  addSubtask() {}

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
    this.saveToLocalStorage();
  }

  updateTask(taskId, newStatus) {
    const task = this.taskList.find((task) => task.id === parseInt(taskId));
    if (task) {
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
      this.saveToLocalStorage();
    }
  }

  assignTask(taskId, assignee) {
    const task = this.taskList.find((task) => task.id === parseInt(taskId));
    if (task) {
      task.assignee = assignee;
      this.saveToLocalStorage();
    }
  }

  getTasksWithProject(projectId) {
    return this.taskList.filter(
      (task) => task.projectId === parseInt(projectId),
    );
  }

  updateTaskData(
    taskId,
    newTitle,
    newDescription,
    newProjectId,
    newAssignee,
    newDeadline,
    newPriority,
    newStatus,
    newSubTasks,
  ) {
    const task = this.taskList.find((task) => task.id === parseInt(taskId));

    if (task) {
      task.title = newTitle || task.title;
      task.description = newDescription || task.description;
      task.projectId = newProjectId || task.projectId;
      task.assignee = newAssignee || task.assignee;
      task.deadline = newDeadline || task.deadline;
      task.priority = newPriority || task.priority;
      task.status = newStatus || task.status;
      task.subTasks = newSubTasks || task.subTasks;
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage() {
    localStorage.setItem("tasks_key", JSON.stringify(this.taskList));
    localStorage.setItem("task_id_key", this.taskId);
  }

  loadFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks_key");
    if (storedTasks !== null) {
      this.taskList = JSON.parse(storedTasks);
    }

    const lastTaskId = localStorage.getItem("task_id_key");
    if (lastTaskId !== null) {
      this.taskId = Number(lastTaskId);
    }
  }
}
