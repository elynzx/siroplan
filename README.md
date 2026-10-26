# Siro Plan - Gestor de Proyectos y Tareas

Un planificador web con tablero Kanban para administrar múltiples proyectos y sus respectivas tareas de forma organizada. Desarrollado con HTML, CSS y JavaScript Vanilla de manera modular.

## ¿Cómo funciona?
La aplicación permite crear proyectos independientes y asociarles tareas. El flujo de trabajo se organiza en tres columnas de estado: Por hacer, En proceso y Realizado.

### Características del código:
* **Validación de formularios:** Revisa que los campos cumplan con las reglas de longitud e inyecta los mensajes de error directo en la interfaz.
* **Lógica orientada a objetos:** Uso de clases (Managers) para controlar el almacenamiento y filtrado en memoria.

* **Componentes modulares:** El HTML de las tarjetas, pestañas y modales se genera dinámicamente desde archivos JS independientes.

* **Eliminación limpia:** Borra las tareas de la pantalla y actualiza el arreglo interno al presionar el botón de eliminar.

## Estructura de carpetas
* `/models`: Estructura base de los objetos (Task y Project).
* `/services`: Gestión de los arreglos en memoria (TaskManager y ProjectManager).
* `/components`: Renderizado de la interfaz (Tablero, Tarjetas, Pestañas y Modales).
* `/utils`: Funciones de validación y carga de datos iniciales de prueba.

## Instalación y Ejecución

Al utilizar módulos nativos de JavaScript, el navegador requiere ejecutarse bajo un servidor local.

1. Clonar el repositorio:
```bash
git clone https://github.com/elynzx/siroplan.git
```

2. Entrar a la carpeta del proyecto:
```bash
cd siro-app
```

3. Abrir en Visual Studio Code:
```bash
code .
```

4. Ejecutar el proyecto:
* Da clic derecho sobre el archivo `index.html`.
* Selecciona la opción **Open with Live Server**.
