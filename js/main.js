// ==========================================
// 1. GLOBAL STATE 
// ==========================================

const clients = JSON.parse(localStorage.getItem("clients")) || [];


let mode = "add"; // Internal form state: "add" or "save"
let clientBeingEdited = null;

//Filters
let cityGroup = []
let statusGroup = null 
let sortGroup = null 

//Table 
let clientsToDisplay = [];
let indexInicial = 0;
let indexFinal = 10;

// ==========================================
// 2. DOM ELEMENTS
// ==========================================

// Form
const openFormButton = document.querySelector(".add-client-button");
const modalForm = document.querySelector(".modal-form");
const closeFormButton = document.querySelector(".close-modal-button");
const modalOverlay = document.querySelector(".overlay")
const clientForm = document.querySelector(".client-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const cityInput = document.getElementById("city");
const statusInput = document.getElementById("status");
const addButton = document.querySelector(".form-submit-button");


// Filters
const cityFilter = document.getElementById("city-filter");
const statusFilter = document.getElementById("status-filter");
const sortFilter = document.getElementById("sort-filter");
const clearFiltersButton = document.querySelector(".clear-filters-button");

// List / counters
const clientList = document.querySelector(".client-list");
const totalClient = document.querySelector(".total-client");
const totalActiveClient = document.querySelector(".total-active-client");
const appliedFilterList = document.querySelector(".applied-filter-list");

//Table
const tableControl = document.querySelector(".table-control");
const previousTable = document.querySelector(".previous")
const nextTable = document.querySelector(".next")

// ==========================================
// 3. DATA PERSISTENCE
// ==========================================
function saveClientsLs() {
    localStorage.setItem("clients", JSON.stringify(clients))
}


// ==========================================
// 4. FORM AND MODAL
// ==========================================
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
        status: statusInput.checked
    };
}

function addClient() {

    const client = {
        id: crypto.randomUUID(),
        ...getClientFormData()
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
    Object.assign(client, getClientFormData());

    saveClientsLs()
    applyFilters();
    resetForm();
}

// ==========================================
// 5. FILTERS
// ==========================================

function handleCityFilter() {

    const selectedCity = cityFilter.value

    if (selectedCity === "all") {
        return
    };

    if(!cityGroup.includes(selectedCity)){
        cityGroup.push(selectedCity)
    }

    cityFilter.value = "all"

    applyFilters();
}

function handleStatusFilter() {

    const selectedStatus = statusFilter.value

    if (selectedStatus === "all") {
         return   
    };

    statusGroup = null 

    if(selectedStatus === "actives"){
        statusGroup = true
    } 

    if(selectedStatus === "inactives") {
        statusGroup = false
    }
    
    statusFilter.value = "all"

    applyFilters();
}

function handleSortFilter() {
    const selectedSort = sortFilter.value;

    if (selectedSort === "no-sort") {
        return;
    }

    sortGroup = null;

    if (selectedSort === "name-a-z") {
        sortGroup = "name-a-z"
    }

    if (selectedSort === "name-z-a") {
        sortGroup = "name-z-a"
    }

    sortFilter.value = "no-sort";

    applyFilters();
}

function clearFilters() {
    cityGroup = []
    statusGroup = null 
    sortGroup = null 

    cityFilter.value = "all";
    statusFilter.value= "all";
    sortFilter.value = "no-sort";
    
    applyFilters();
}

function applyFilters() {

    clientsToDisplay = [...clients];
    
    if (cityGroup.length > 0) {
        clientsToDisplay = clientsToDisplay.filter(client =>
            cityGroup.includes(client.city)
        );
        indexInicial = 0;
    }

    if(statusGroup !== null) {
        clientsToDisplay = clientsToDisplay.filter(client =>
            client.status === statusGroup
        );
        indexInicial = 0;
    }

    if(sortGroup === "name-a-z") {
        clientsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        indexInicial = 0;
    }

    if(sortGroup === "name-z-a") {
        clientsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
        indexInicial = 0;
    }

    updateScreen();
    appliedFilters();  
}

// ==========================================
// 6. UI RENDERING
// ==========================================

function renderAppliedFilter(text, onDelete) {

    const filterBox = document.createElement("div")
    // appliedCityBox.classList.add("applied-city-box");

    const deleteFilter = document.createElement("button")
    deleteFilter.classList.add("delete-filter")
    deleteFilter.textContent = `X`

    const filterText = document.createElement("span")
    // appliedCity.classList.add("applied-city")
    filterText.textContent = text
    
    filterBox.append(deleteFilter, filterText)
    appliedFilterList.append(filterBox)

    deleteFilter.addEventListener("click", () => {
        
        onDelete()
        filterBox.remove()
        applyFilters()              
    })     
}

function appliedFilters() {
    
    indexInicial = 0;
    appliedFilterList.textContent = "";

    cityGroup.forEach((city, index) => {

        renderAppliedFilter(city, 
            () => {
            cityGroup.splice(index, 1)
            
        })
    })

    if(statusGroup !== null) {

        renderAppliedFilter(statusGroup ? "Ativos" : "Inativos", 
            () => {
            statusGroup = null   
        })
    }

    if(sortGroup !== null) {

        renderAppliedFilter(
            sortGroup === "name-a-z" ? "Nome: A → Z" : "Nome: Z → A", 
            () => {
            sortGroup = null    
        })
    }
}

function updateScreen() {
    renderTablePage();
    updatePeopleCount();
    countActivePeople();
}

function renderTablePage() {
    const pageClients = clientsToDisplay.slice(indexInicial, indexInicial + indexFinal)

    renderPeople(pageClients, indexInicial)
    updateTablePageCount()
}

function renderPeople(clientToRender, indexInicial) {
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

        idCell.textContent = indexInicial += 1;
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

        const moreInfoButton = document.createElement("button");
        moreInfoButton.classList.add("table-action-button")
        moreInfoButton.innerHTML = `<span class="material-symbols-outlined info-client-symbol">visibility</span>`;

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

        actionsCell.append(editButton, removeButton, moreInfoButton);
        tableRow.append(idCell, nameCell, emailCell, phoneCell, cityCell, statusCell, actionsCell);
        clientList.append(tableRow);
    });
}

function updateTablePageCount() {

    const tablePageCount = document.querySelector(".table-page-count")
    tablePageCount.textContent = ""

    let pageTotal = indexInicial + indexFinal - 1 > clientsToDisplay.length ? clientsToDisplay.length : indexFinal + indexInicial

    tablePageCount.textContent = `Mostrando ${indexInicial + 1} até ${pageTotal} de ${clientsToDisplay.length}`

    tableControl.prepend(tablePageCount)
}


function updatePeopleCount() {

    totalClient.textContent = `Clientes: ${clientsToDisplay.length}`;
};

function countActivePeople() {

    const activeClient = clientsToDisplay.filter(client => client.status).length;
    totalActiveClient.textContent = `Ativos: ${activeClient}`;
};

// ==========================================
// 7. INITIAL RENDER
// ==========================================
applyFilters()
// updateScreen()
// appliedFilters();

// ==========================================
// 8. EVENTS
// ==========================================
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
    }
    
    if (mode === "save") {
        saveClient(clientBeingEdited);
        closeForm();
    }
});

cityFilter.addEventListener("change", handleCityFilter);
statusFilter.addEventListener("change", handleStatusFilter);
sortFilter.addEventListener("change", handleSortFilter);

clearFiltersButton.addEventListener("click", clearFilters);

modalOverlay.addEventListener("click", closeForm);

nextTable.addEventListener("click", () => {
    if(indexInicial + indexFinal < clientsToDisplay.length){
        indexInicial += indexFinal
        renderTablePage() 
    }  
})

previousTable.addEventListener("click", () => { 
     if(indexInicial > 0) {
        indexInicial -= indexFinal
        renderTablePage()   
    }   
})  

