export function initConfirmationModal() {
  const modalOverlay = document.querySelector(".overlay");
  const modalContainer = document.querySelector(".confirmation-modal");
  const cancelButton = document.querySelector(".cancel-button");
  const deleteButton = document.querySelector(".delete-button");

  function openModal() {
    modalContainer.classList.add("active");
    modalOverlay.classList.add("active");
  }

  function closeModal() {
    modalContainer.classList.remove("active");
    modalOverlay.classList.remove("active");
  }

  function confirm() {
    return new Promise((resolve) => {
      openModal();

      cancelButton.onclick = () => {
        closeModal();
        resolve(false);
      };

      deleteButton.onclick = () => {
        closeModal();
        resolve(true);
      };
    });
  }

  modalOverlay.addEventListener("click", () => {
    if (modalContainer.classList.contains("active")) {
      closeModal();
    }
  });

  return { confirm }
}
