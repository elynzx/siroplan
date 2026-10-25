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
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.project = project;
    this.assignee = assignee;
    this.deadline = deadline;
    this.priority = priority;
    this.status = status;
  }
}
