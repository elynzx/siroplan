export class SubTask {
  constructor(description, completed = false, id = crypto.randomUUID()) {
    this.id = id;
    this.description = description;
    this.completed = completed;
  }
}
