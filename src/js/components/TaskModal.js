export function renderTaskModal() {
  const modalContainer = document.createElement("div");
  modalContainer.id = "taskModalRoot";

  modalContainer.innerHTML = `
        <div class="modal-overlay">
            <article class="modal-card modal-task">
                <button type="button" id="closeTaskX" class="btn btn-small modal-close-btn"><i class='bx bx-x bx-sm'></i></button>
                <header class="modal-header">
                    <span class="subtitle">A new little goal</span>
                    <h2 class="title">Create a new task</h2>
                </header>
                <form id="formModalTask" class="modal-form">
                    
                    <div class="form-group">
                        <label for="task-title">Task Title</label>
                        <input type="text" id="task-title" placeholder="What would you like to do?" required autocomplete="off">
                    </div>
                    
                    <div class="form-group">
                        <label for="task-desc">Description</label>
                        <textarea id="task-desc" placeholder="Add a few details..."></textarea>
                    </div>

                    <div class="form-group">
                        <label>Sub-tasks checklist</label>
                        <div class="checklist-input-wrapper">
                            <input type="checkbox" class="checklist-checkbox" disabled>
                            <input type="text" id="inputSubtask" placeholder="Add a small step..." autocomplete="off">
                            <button type="button" id="btnAddSubtask" class="btn-add-step">+</button>
                        </div>
                    </div>

                    <div class="form-grid-2col">
                        
                        <div class="form-group">
                            <label for="task-project">Project</label>
                            <div class="select-wrapper">
                                <select id="task-project">
                                    <option value="1" selected>Web Programming</option>
                                    <option value="2">Design Exam</option>
                                    <option value="3">Thesis</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="task-assignee">Assignee</label>
                            <input type="text" id="task-assignee" value="Mina Park">
                        </div>

                        <div class="form-group">
                            <label for="task-date">Due Date</label>
                            <input type="date" id="task-date">
                        </div>

                        <div class="form-group">
                            <label for="task-priority">Priority</label>
                            <div class="select-wrapper">
                                <select id="task-priority">
                                    <option value="low">Low</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                        </div>

                    </div>

                    <footer class="modal-footer">
                        <button type="button" id="closeTaskCancel" class="btn btn-secondary">Maybe later</button>
                        <button type="submit" class="btn btn-primary"><i class='bx bx-plus'></i> Create Task</button>
                    </footer>
                </form>
            </article>
        </div>
    `;

  document.body.appendChild(modalContainer);

  function destroyModal() {
    modalContainer.remove();
  }

  document.getElementById("closeTaskX").addEventListener("click", destroyModal);
  document
    .getElementById("closeTaskCancel")
    .addEventListener("click", destroyModal);

  document
    .getElementById("formModalTask")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const taskTitle = document.getElementById("task-title").value;

      console.log("Guardando nueva tarea:", taskTitle);

      destroyModal();
    });
}
