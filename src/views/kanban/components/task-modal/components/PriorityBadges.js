export function initPriorityBadges(modalContainer) {
  const priorityInput = modalContainer.querySelector("#task-priority");
  const badges = modalContainer.querySelectorAll("#priorityBadgesGroup .modal-choice-badge");

  badges.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedPriority = btn.dataset.priority;
      priorityInput.value = selectedPriority;

      badges.forEach((b) => {
        b.classList.toggle("active", b.dataset.priority === selectedPriority);
      });
    });
  });
}

/**
 * Updates the active priority badge and hidden input value.
 *
 * @param {HTMLElement} modalContainer - The parent DOM element of the modal.
 * @param {string} selectedPriority - The priority value to select: "Low", "Medium", "High".
 * @returns {void}
 */
export function setSelectedPriority(modalContainer, selectedPriority) {
  const priorityInput = modalContainer.querySelector("#task-priority");
  if (priorityInput) priorityInput.value = selectedPriority;

  modalContainer.querySelectorAll("#priorityBadgesGroup .modal-choice-badge").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.priority === selectedPriority);
  });
}