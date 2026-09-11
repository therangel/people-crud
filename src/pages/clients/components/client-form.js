let mode = "add"; // Internal form state: "add" or "save"
let clientBeingEdited = null;

// ==========================================
// 4. FORM AND MODAL
// ==========================================

export function initClientForm(clients, saveClientsLs, onCLientChange) {

  const openFormButton = document.querySelector(".add-client-button");
  const modalForm = document.querySelector(".modal-form");
  const closeFormButton = document.querySelector(".close-modal-button");
  const modalOverlay = document.querySelector(".overlay");
  const clientForm = document.querySelector(".client-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const cityInput = document.getElementById("city");
  const statusInput = document.getElementById("status");
  const addButton = document.querySelector(".form-submit-button");

  function openForm() {
    modalForm.classList.add("active");
    modalOverlay.classList.add("active");
  }

  function closeForm() {
    modalForm.classList.remove("active");
    modalOverlay.classList.remove("active");
  }

  function clearForm() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    cityInput.value = "";
    statusInput.checked = false;
  }

  function resetForm() {
    clearForm();
    clientBeingEdited = null;
    mode = "add";
    addButton.textContent = "Adicionar";
  }

  function getClientFormData() {
    return {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: Number(phoneInput.value),
      city: cityInput.value.trim(),
      status: statusInput.checked,
    };
  }

  function addClient() {
    const client = {
      id: crypto.randomUUID(),
      ...getClientFormData(),
    };

    clients.push(client); //enviando novo cliente para o array original de clientes

    saveClientsLs(clients); // chama função de salvar cliente no local storage
    clearForm();
    onCLientChange();
  }

  function editClient(client) {
    nameInput.value = client.name;
    emailInput.value = client.email;
    phoneInput.value = client.phone;
    cityInput.value = client.city;
    statusInput.checked = client.status;

    addButton.textContent = "Salvar";
    clientBeingEdited = client;
    mode = "save";
  }

  function saveClient(clientBeingEdited) {
    Object.assign(clientBeingEdited, getClientFormData());

    saveClientsLs(clients);
    onCLientChange();
    resetForm();
  }

  openFormButton.addEventListener("click", () => {
    resetForm();
    openForm();
  });

  closeFormButton.addEventListener("click", closeForm);

  clientForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (mode === "add") {
      addClient(); 
    }

    if (mode === "save") {
      saveClient(clientBeingEdited);
    }

    closeForm();
  });
  
  modalOverlay.addEventListener("click", () => {
    if (modalForm.classList.contains("active")) {
      closeForm();
    }

  });

  return { editClient, openForm }
}

  