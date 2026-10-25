import { Project } from "../models/Project.js";

export class ProjectManager {
  constructor() {
    this.projectList = [];
    this.projectId = 0;
  }

  addProject(title) {
    const newProject = new Project(this.projectId, title);
    this.projectList.push(newProject);
    this.projectId++;
    return newProject;
  }

  getAllProjects() {
    return this.projectList;
  }

  getProjectById(projectId) {
    return this.projectList.find(
      (project) => project.id === parseInt(projectId),
    );
  }

  deleteProject(projectId) {
    this.projectList = this.projectList.filter(
      (project) => project.id !== parseInt(projectId),
    );
  }
}
