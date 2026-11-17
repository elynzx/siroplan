import { SubTask } from "./SubTask.js";
export class Task {
  constructor(
    id,
    title,
    description,
    project,
    assignee,
    deadline,
    priority,
    status,
    subTasks = [],
    updatedAt = new Date().toISOString(),
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.project = project;
    this.assignee = assignee;
    this.deadline = deadline;
    this.priority = priority;
    this.status = status;
    this.subTasks = subTasks;
    this.updatedAt = updatedAt;
  }
}
