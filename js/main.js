// ==========================================
// 1. GLOBAL STATE OF DATA
// ==========================================
// Data shared across the entire application
const clients = JSON.parse(localStorage.getItem("clients")) || [];

function saveClientsLs() {
    localStorage.setItem("clients", JSON.stringify(clients))
}
// ==========================================
// 2. CONTEXT: FORM AND MODAL (CLIENTS)
// ==========================================

// DOM Elements and Control Variables
const openFormButton = document.querySelector(".add-client-button");
const modalForm = document.querySelector(".modal-form");
const closeFormButton = document.querySelector(".close-modal-button");

const clientForm = document.querySelector(".client-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const cityInput = document.getElementById("city");
const statusInput = document.getElementById("status");
const addButton = document.querySelector(".form-submit-button");

let mode = "add"; // Internal form state: "add" or "save"
let clientBeingEdited = null;

// Form Functions
function openForm() {
    modalForm.classList.add("active");
}

function closeForm() {
    modalForm.classList.remove("active");
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

function addClient() {

    // const formattedInputCIty = cityInput.value
    // .toLowerCase()
    // .split(" ")
    // .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    // .join(" ")

    const client = {
        id: crypto.randomUUID(),
        name: nameInput.value.trim(),
        email: emailInput.value,
        phone: Number(phoneInput.value),
        city: cityInput.value.trim(),
        status: statusInput.checked
    };

    clients.push(client);
    saveClientsLs()
    clearForm();
    applyFilters();
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

function saveClient(client) {
    client.name = nameInput.value;
    client.email = emailInput.value;
    client.phone = Number(phoneInput.value);
    client.city = cityInput.value;
    client.status = statusInput.checked;

    saveClientsLs()
    applyFilters();
    resetForm();
}

// Form Events
openFormButton.addEventListener("click", () => {
    resetForm();
    openForm();
});

closeFormButton.addEventListener("click", closeForm);

clientForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (mode === "add") {
        addClient();
        closeForm();
    } else if (mode === "save") {
        saveClient(clientBeingEdited);
        closeForm();
    }
});


// ==========================================
// 3. CONTEXT: FILTER AND SEARCH SYSTEM
// ==========================================

// Filter DOM Elements
const cityFilter = document.getElementById("city-filter");
const statusFilter = document.getElementById("status-filter");
const sortFilter = document.getElementById("sort-filter");
const clearFiltersButton = document.querySelector(".clear-filters-button");


let cityGroup = []
let statusGroup = [] 
let sortGroup = [] 

// Filtering and Sorting Functions
function clearFilters() {

    cityGroup = []
    statusGroup = [] 
    sortGroup = [] 

    cityFilter.value = "all";
    statusFilter.value= "all";
    sortFilter.value = "no-sort";
    
    applyFilters();
}

function applyFilters() {

    let filteredClient = clients;
    //1
    if (cityFilter.value !== "all") {
        if(!cityGroup.includes(cityFilter.value)){
            cityGroup.push(cityFilter.value)
        }
        cityFilter.value = "all"
    };

    if (cityGroup.length > 0) {
        filteredClient = filteredClient.filter(client =>
            cityGroup.includes(client.city)
        );
    }

    // 2
    if (statusFilter.value !== "all") {
        statusGroup = []
        if(statusFilter.value === "actives"){
            statusGroup.push(true)
        } else if(statusFilter.value === "inactives") {
            statusGroup.push(false)
        }
        
        statusFilter.value = "all"
        
    };

    if(statusGroup.length > 0) {
        filteredClient = filteredClient.filter(client =>
            statusGroup.includes(client.status)
        );
 
    }

    // 3
    let sortedClient = [...filteredClient];

    if (sortFilter.value !== "no-sort") {
        sortGroup = []
        if (sortFilter.value === "name-a-z") {
            sortGroup.push("Nome: A → Z")
            sortedClient.sort((a, b) => a.name.localeCompare(b.name));
            
        } else if (sortFilter.value === "name-z-a") {
            
            sortGroup.push("Nome: Z → A")
            sortedClient.sort((a, b) => b.name.localeCompare(a.name));

        } 

        sortFilter.value = "no-sort";
    }

    if(sortGroup.length > 0) {

        if (sortGroup.includes("Nome: A → Z")) {
            sortedClient.sort((a, b) => a.name.localeCompare(b.name)); 
        }

        if (sortGroup.includes("Nome: Z → A")) {
            sortedClient.sort((a, b) => b.name.localeCompare(a.name));
        }
 
    }
    
    updateScreen(sortedClient);
    appliedFilters();  
}

// Filter Events
cityFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

clearFiltersButton.addEventListener("click", clearFilters);


// ==========================================
// 4. CONTEXT: SCREEN RENDERING (UI)
// ==========================================

// Elementos do DOM da Listagem e Cards/Tags
const clientList = document.querySelector(".client-list");
const totalClient = document.querySelector(".total-client");
const totalActiveClient = document.querySelector(".total-active-client");
let appliedFilterList = document.querySelector(".applied-filter-list")

updateScreen(clients)

// Visual Interface (UI) Functions
function appliedFilters() {

    appliedFilterList.textContent = ""
    

    cityGroup.forEach((city, index) => {

        const appliedCityBox = document.createElement("div")
        appliedCityBox.classList.add("applied-city-box");

        const deleteFilter = document.createElement("button")
        deleteFilter.classList.add("delete-filter")
        deleteFilter.textContent = `X`

        const appliedCity = document.createElement("span")
        appliedCity.classList.add("applied-city")
        appliedCity.textContent = city
        
        appliedCityBox.append(deleteFilter, appliedCity)
        appliedFilterList.append(appliedCityBox)

        deleteFilter.addEventListener("click", () => {
            
            cityGroup.splice(index, 1)
            appliedCityBox.remove()
            
            applyFilters()
              
        })  
    })

    statusGroup.forEach((status, index) => {

        const appliedStatusBox = document.createElement("div")
        appliedStatusBox.classList.add("applied-status-box");

        const deleteFilter = document.createElement("button")
        deleteFilter.classList.add("delete-filter")
        deleteFilter.textContent = `X`

        const appliedStatus = document.createElement("span")
        appliedStatus.classList.add("applied-status")
        appliedStatus.textContent = status ? "Ativos" : "Inativos"
        
        appliedStatusBox.append(deleteFilter, appliedStatus)
        appliedFilterList.append(appliedStatusBox)

        deleteFilter.addEventListener("click", () => {
            
            statusGroup.splice(index, 1)
            appliedStatusBox.remove()
            applyFilters()        
        })   
    })

    sortGroup.forEach((sort, index) => {
        
        const appliedSortBox = document.createElement("div")
        appliedSortBox.classList.add("applied-sort-box");

        const deleteFilter = document.createElement("button")
        deleteFilter.classList.add("delete-filter")
        deleteFilter.textContent = `X`

        const appliedSort = document.createElement("span")
        appliedSort.classList.add("applied-sort")
        appliedSort.textContent = sort 
        
        appliedSortBox.append(deleteFilter, appliedSort)
        appliedFilterList.append(appliedSortBox)

        deleteFilter.addEventListener("click", () => {
            
            sortGroup.splice(index, 1)
            appliedSortBox.remove()
            applyFilters()    
        })  
    })
}

function updateScreen(clientList) {
    renderPeople(clientList);
    updatePeopleCount(clientList);
    countActivePeople(clientList);
    console.log("ListaFiltrada",clientList)
}

function renderPeople(clientToRender) {
    clientList.innerHTML = "";

    clientToRender.forEach((client, index) => {
        const tableRow = document.createElement("tr");

        const idCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const emailCell = document.createElement("td");
        const phoneCell = document.createElement("td");
        const cityCell = document.createElement("td");
        const statusCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        idCell.textContent = client.id;
        nameCell.textContent = client.name;
        emailCell.textContent = client.email;
        phoneCell.textContent = client.phone;
        cityCell.textContent = client.city;
        statusCell.textContent = client.status ? "Ativo" : "Inativo";

        const removeButton = document.createElement("button");
        removeButton.classList.add("table-action-button")
        removeButton.innerHTML = `<span class="material-symbols-outlined delete-client-symbol">delete</span>`;

        const editButton = document.createElement("button");
        editButton.classList.add("table-action-button")
        editButton.innerHTML = `<span class="material-symbols-outlined edit-client-symbol">edit</span>`;

        // Internal events of the table buttons
        removeButton.addEventListener("click", () => {
            const personIndex = clients.findIndex(
                currentPerson => currentPerson.id === client.id
            );

            if (personIndex !== -1) {
                clients.splice(personIndex, 1);

                saveClientsLs()
                applyFilters();
            }
        });

        editButton.addEventListener("click", () => {
            const clientToEdit = clientToRender[index];
            editClient(clientToEdit);
            openForm();
        });

        actionsCell.append(editButton, removeButton);
        tableRow.append(idCell, nameCell, emailCell, phoneCell, cityCell, statusCell, actionsCell);
        clientList.append(tableRow);
    });
}


function updatePeopleCount(clientList) {

    totalClient.textContent = `Clientes: ${clientList.length}`;
};

function countActivePeople(clientList) {

    const activeClient = clientList.filter(
        client => client.status
    );

    totalActiveClient.textContent = `Ativos: ${activeClient.length}`;
};

console.log("lista",clients)