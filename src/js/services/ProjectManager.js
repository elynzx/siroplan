import { Project } from "../models/Project.js";

export class ProjectManager {
  constructor() {
    this.projectList = [];
    this.projectId = 1;
  }

  addProject(title) {
    const newProject = new Project(this.projectId, title);
    this.projectList.push(newProject);
    this.projectId++;
    this.saveToLocalStorage();
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
    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem("projects_key", JSON.stringify(this.projectList));
    localStorage.setItem("project_id_key", this.projectId);
  }

  loadFromLocalStorage() {
    const storedProjects = localStorage.getItem("projects_key");
    if (storedProjects !== null) {
      this.projectList = JSON.parse(storedProjects);
    }

    const lastProjectId = localStorage.getItem("project_id_key");
    if (lastProjectId !== null) {
      this.projectId = Number(lastProjectId);
    }
  }
}
