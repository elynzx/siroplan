export function setupInitialTasks(taskManager, projectManager) {
  projectManager.addProject("Programación Web");
  projectManager.addProject("Examen de Diseño");
  projectManager.addProject("Tesis");

  taskManager.addTask(
    "Diseño en Figma",
    "Ajustar la paleta de colores.",
    "2",
    "Evelyn Pascual",
    "2026-10-28",
    "High",
    "Done",
  );
  taskManager.addTask(
    "Código JS",
    "Conectar los botones del modal.",
    "1",
    "Evelyn Pascual",
    "2026-10-30",
    "Medium",
    "In Progress",
  );
  taskManager.addTask(
    "Buscar papers",
    "Revisar referencias en Scopus.",
    "3",
    "Evelyn Pascual",
    "2026-11-05",
    "Low",
    "To Do",
  );
  taskManager.addTask(
    "Subir a GitHub",
    "Crear repositorio inicial.",
    "1",
    "Evelyn Pascual",
    "2026-10-26",
    "Medium",
    "To Do",
  );
  taskManager.addTask(
    "Redactar intro",
    "Escribir marco teórico.",
    "3",
    "Evelyn Pascual",
    "2026-11-10",
    "High",
    "In Progress",
  );
}
