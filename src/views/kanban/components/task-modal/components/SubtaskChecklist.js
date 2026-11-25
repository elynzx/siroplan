export function initSubtaskChecklist(modalContainer, initialSubtasks = []) {

  const pendingSubtasks = initialSubtasks.map((subtask) => ({
    id: subtask.id || crypto.randomUUID(),
    description: subtask.description,
    completed: Boolean(subtask.completed),
  }));

  const inputSubtask = modalContainer.querySelector("#inputSubtask");
  const btnAddSubtask = modalContainer.querySelector("#btnAddSubtask");
  const subtasksPreviewList = modalContainer.querySelector("#subtasksPreviewList");
  const subtaskCounterBadge = modalContainer.querySelector("#subtaskCounterBadge");

  /**
   * Renders the current list of pending subtasks into the DOM.
   */
  function renderList() {
    if (!subtasksPreviewList) return;

    const count = pendingSubtasks.length;
    if (subtaskCounterBadge) {
      subtaskCounterBadge.textContent = `${count} ${count === 1 ? "step" : "steps"}`;
    }

    subtasksPreviewList.innerHTML = pendingSubtasks
      .map(
        (subtask, index) => `
        <div class="modal-subtask-item ${subtask.completed ? "checked" : ""}" data-index="${index}">
          <button type="button" class="subtask-checkbox btn-toggle-subtask" data-index="${index}">
            <i class="hn hn-check-solid"></i>
          </button>
          <input type="text" class="modal-subtask-input input-edit-subtask" data-index="${index}" value="${subtask.description}" ${subtask.completed ? "disabled readonly" : ""}>
          <button type="button" class="btn btn-small btn-remove-subtask" data-index="${index}">
            <i class="hn hn-times-solid"></i>
          </button>
        </div>
      `
      )
      .join("");

    // Toggle completion status
    subtasksPreviewList.querySelectorAll(".btn-toggle-subtask").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number(e.currentTarget.dataset.index);
        pendingSubtasks[index].completed = !pendingSubtasks[index].completed;
        renderList();
      });
    });

    // Update description on change
    subtasksPreviewList.querySelectorAll(".input-edit-subtask").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = Number(e.currentTarget.dataset.index);
        const subtaskDescription = e.currentTarget.value.trim();
        if (subtaskDescription) {
          pendingSubtasks[index].description = subtaskDescription;
        } else {
          pendingSubtasks.splice(index, 1);
          renderList();
        }
      });
    });

    // Remove subtask
    subtasksPreviewList.querySelectorAll(".btn-remove-subtask").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = Number(e.currentTarget.dataset.index);
        pendingSubtasks.splice(index, 1);
        renderList();
      });
    });
  }

  /**
   * Reads the current subtask input field and adds a new subtask to the list.
   */
  function addSubtask() {
    const text = inputSubtask.value.trim();
    if (text) {
      pendingSubtasks.push({
        id: crypto.randomUUID(),
        description: text,
        completed: false,
      });
      inputSubtask.value = "";
      inputSubtask.focus();
      renderList();
    }
  }

  if (btnAddSubtask) btnAddSubtask.addEventListener("click", addSubtask);
  if (inputSubtask) {
    inputSubtask.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSubtask();
      }
    });
  }

  renderList();

  /**
   * Retrieves the final list of subtasks, including any unadded subtask in the input.
   */
  return function getFinalSubtasks() {
    const extraText = inputSubtask ? inputSubtask.value.trim() : "";
    if (extraText) {
      pendingSubtasks.push({
        id: crypto.randomUUID(),
        description: extraText,
        completed: false,
      });
    }
    return pendingSubtasks;
  };
}