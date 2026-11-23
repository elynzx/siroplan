export class SubTask {
  constructor(id = crypto.randomUUID(), description, completed = false) {
    this.id = id;
    this.description = description;
    this.completed = completed;
  }
}
