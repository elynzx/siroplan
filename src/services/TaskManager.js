import { Task } from "../models/Task.js";
import { SubTask } from "../models/SubTask.js";

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
    subTasks = [],
    updatedAt
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
      updatedAt
    );

    this.taskList.push(newTask);
    this.taskId++;
    this.saveToLocalStorage();
    return newTask;
  }

  getTaskById(taskId) {
    return this.taskList.find((task) => task.id === Number(taskId));
  }

  getAllTasks() {
    return this.taskList;
  }

  getTasksWithStatus(status) {
    return this.taskList.filter((task) => task.status === status);
  }

  getTasksWithProject(projectId) {
    return this.taskList.filter(
      (task) => Number(task.project) === Number(projectId)
    );
  }

  updateTaskStatus(taskId, newStatus) {
    const task = this.getTaskById(taskId);
    if (task) {
      task.status = newStatus;
      task.updatedAt = new Date().toISOString();
      this.saveToLocalStorage();
    }
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
    newSubTasks
  ) {
    const task = this.getTaskById(taskId);
    if (task) {
      task.title = newTitle || task.title;
      task.description = newDescription || task.description;
      task.project = newProjectId || task.project;
      task.assignee = newAssignee || task.assignee;
      task.deadline = newDeadline || task.deadline;
      task.priority = newPriority || task.priority;
      task.status = newStatus || task.status;
      task.subTasks = newSubTasks || task.subTasks;
      task.updatedAt = new Date().toISOString();
      this.saveToLocalStorage();
    }
  }

  deleteTask(taskId) {
    this.taskList = this.taskList.filter((task) => task.id !== Number(taskId));
    this.saveToLocalStorage();
  }

  /* SubTasks */
  addSubtask(taskId, description, completed = false) {
    const task = this.getTaskById(taskId);
    if (task && description && description.trim() !== "") {
      if (!Array.isArray(task.subTasks)) {
        task.subTasks = [];
      }
      const newSubtask = new SubTask(description.trim(), Boolean(completed));
      task.subTasks.push(newSubtask);
      this.saveToLocalStorage();
      return newSubtask;
    }
    return null;
  }

  toggleSubtask(taskId, subtaskId) {
    const task = this.getTaskById(taskId);
    if (task && Array.isArray(task.subTasks)) {
      const subtask = task.subTasks.find((st) => st.id === subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
        this.saveToLocalStorage();
        return subtask;
      }
    }
    return null;
  }

  deleteSubtask(taskId, subtaskId) {
    const task = this.getTaskById(taskId);
    if (task && Array.isArray(task.subTasks)) {
      task.subTasks = task.subTasks.filter((st) => st.id !== subtaskId);
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