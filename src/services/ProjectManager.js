import { Project } from "../models/Project.js";

export class ProjectManager {
  constructor() {
    this.projectList = [];
    this.projectId = 1;
    this.activeProjectId = "all";
  }

  addProject(title) {
    const newProject = new Project(this.projectId, title);
    this.projectList.push(newProject);
    this.projectId++;
    this.saveToLocalStorage();
    return newProject;
  }

  getProjectById(projectId) {
    return this.projectList.find((project) => project.id === Number(projectId));
  }

  getAllProjects() {
    return this.projectList;
  }

  setActiveProject(projectId) {
    this.activeProjectId = String(projectId);
  }

  getActiveProject() {
    return this.activeProjectId;
  }

  updateProject(projectId, newTitle) {
    const project = this.getProjectById(projectId);
    if (project && newTitle && newTitle.trim() !== "") {
      project.title = newTitle.trim();
      this.saveToLocalStorage();
    }
  }

  deleteProject(projectId) {
    this.projectList = this.projectList.filter(
      (project) => project.id !== Number(projectId),
    );
    if (String(this.activeProjectId) === String(projectId)) {
      this.activeProjectId = "all";
    }
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
