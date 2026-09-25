import { getStates } from "../../../services/ibge-service";
import { getCep } from "../../../services/cep-service";

let mode = "add"; // Internal form state: "add" or "save"
let clientBeingEdited = null;

// ==========================================
// 4. FORM AND MODAL
// ==========================================

const states  = await getStates()
const stateNames = states.map(state => state.name).sort()


export function initClientForm(clients, saveClientsLs, onCLientChange) {

  const openFormButton = document.querySelector(".add-client-button");
  const modalForm = document.querySelector(".modal-form");
  const closeFormButton = document.querySelector(".close-modal-button");
  const modalOverlay = document.querySelector(".overlay");
  const clientForm = document.querySelector(".client-form");

  // Personal Fields Form
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  // Adress Fields Form
  const cepInput = document.getElementById("cep");
  const stateInput = document.getElementById("state");
  const cityInput = document.getElementById("city");
  const districtInput = document.getElementById("district");
  const streetInput = document.getElementById("street");
  const houseNumberInput = document.getElementById("house-number");
  const complementInput = document.getElementById("complement");

  const statusInput = document.getElementById("status");

  const addButton = document.querySelector(".form-submit-button");
  const stateList = document.querySelector(".list-of-states");

  function renderStatesInput(){
    // console.log(stateNames)
    stateNames.forEach(state => {
      
      const option = document.createElement("option")
      option.setAttribute("value", state)
      stateList.append(option)
    });  
  }

  function openForm() {
    modalForm.classList.add("active");
    modalOverlay.classList.add("active");
    renderStatesInput()
  }

  function closeForm() {
    modalForm.classList.remove("active");
    modalOverlay.classList.remove("active");
  }

  function clearForm() {
    nameInput.value = "";
    surnameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
    cepInput.value = "";
    stateInput.value = "";
    cityInput.value = "";
    districtInput.value = "";
    streetInput.value = "";
    houseNumberInput.value = "";
    complementInput.value = "";
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
      surname: surnameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: Number(phoneInput.value),
      cep: cepInput.value.trim(),
      state: stateInput.value.trim(),
      city: cityInput.value.trim(),
      district: districtInput.value.trim(),
      street: streetInput.value.trim(),
      houseNumber: Number(houseNumberInput.value),
      complement: complementInput.value.trim(),
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
    surnameInput.value = client.surname;
    emailInput.value = client.email;
    phoneInput.value = client.phone;
    cepInput.value = client.cep;
    stateInput.value = client.state;
    cityInput.value = client.city;
    districtInput.value = client.district;
    streetInput.value = client.street;
    houseNumberInput.value = client.houseNumber;
    complementInput.value = client.complement;
    statusInput.checked = client.status

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

  function moreInfoModal() {
    //Criar modal ou deixar no html e puxar 
  }

  const cepField = document.getElementById("cep-field")

  // FILL API CEP
  async function fillCep(valueCep) {

    const data = await getCep(valueCep)

    if(data === null) {

      invalidField(cepField, "CEP")
      stateInput.value = ""
      cityInput.value = ""
      districtInput.value = ""
      streetInput.value = ""
      return
    }

    stateInput.value = data.state;
    cityInput.value = data.city;
    districtInput.value = data.district;
    streetInput.value = data.street;

  }

  function invalidField(cepField, name) {

    if(cepField.value === "" ) return

    const message = document.createElement("span")

    message.classList.add("invalid-field-message")
    message.textContent = `${name} inválido!`
    
    cepField.append(message)
  }

  openFormButton.addEventListener("click", () => {
    resetForm();
    openForm();
  });

  closeFormButton.addEventListener("click", closeForm);

  cepInput.addEventListener("input", (event) => {

    const valueCep = event.currentTarget.value

     if(valueCep.length === 8) {
      fillCep(valueCep)
    } 
  }) 

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

  return { editClient, openForm}
}

  
