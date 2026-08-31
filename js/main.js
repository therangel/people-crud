// ==========================================
// 1. GLOBAL STATE OF DATA
// ==========================================
// Data shared across the entire application
const clients = [];


// ==========================================
// 2. CONTEXT: FORM AND MODAL (CLIENTS)
// ==========================================

// DOM Elements and Control Variables
const openFormButton = document.querySelector(".add-client-button");
const modalForm = document.querySelector(".modal-form");
const closeFormButton = document.querySelector(".close-modal-button");

const clientForm = document.querySelector(".client-form");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const cityInput = document.getElementById("city");
const professionInput = document.getElementById("profession");
const salaryInput = document.getElementById("salary");
const activeInput = document.getElementById("active");
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
    ageInput.value = "";
    cityInput.value = "";
    professionInput.value = "";
    salaryInput.value = "";
    activeInput.checked = false;
}

function resetForm() {
    clearForm();
    clientBeingEdited = null;
    mode = "add";
    addButton.textContent = "Adicionar";
}

function addClient() {
    const client = {
        id: crypto.randomUUID(),
        name: nameInput.value.trim(),
        age: Number(ageInput.value),
        city: cityInput.value.trim(),
        profession: professionInput.value.trim(),
        salary: Number(salaryInput.value),
        active: activeInput.checked
    };

    clients.push(client);
    clearForm();
    applyFilters();
}

function editClient(client) {
    nameInput.value = client.name;
    ageInput.value = client.age;
    cityInput.value = client.city;
    professionInput.value = client.profession;
    salaryInput.value = client.salary;
    activeInput.checked = client.active;

    addButton.textContent = "Salvar";
    clientBeingEdited = client;
    mode = "save";
}

function saveClient(client) {
    client.name = nameInput.value;
    client.age = Number(ageInput.value);
    client.city = cityInput.value;
    client.profession = professionInput.value;
    client.salary = Number(salaryInput.value);
    client.active = activeInput.checked;

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
const professionFilter = document.getElementById("profession-filter");
const activeFilter = document.getElementById("active-filter");
const sortFilter = document.getElementById("sort-filter");
const clearFiltersButton = document.querySelector(".clear-filters-button");

// Filtering and Sorting Functions
function clearFilters(allFilters, filter) {

    if(allFilters) {
        cityFilter.value = "all";
        professionFilter.value = "all";
        activeFilter.checked = false;
        sortFilter.value = "sem-ordenacao";
    } else {
        switch (filter) {
            case "city":
                cityFilter.value = "all";
                break;
            case  "profession":
                professionFilter.value = "all"; 
                break;
            case "active":  
                activeFilter.checked = false; 
                break;
            case "sort":
                sortFilter.value = "sem-ordenacao"; 
                break;
        }       
    }

    applyFilters();
}

function applyFilters() {
    let filteredClient = clients;

    if (cityFilter.value !== "all") {
        filteredClient = filteredClient.filter(
            client => client.city === cityFilter.value 
        );       
    }

    if (professionFilter.value !== "all") {
        filteredClient = filteredClient.filter(
            client => client.profession === professionFilter.value
        );
    }

    if (activeFilter.checked) {
        filteredClient = filteredClient.filter(
            client => client.active
        );
    }

    const sortedClient = [...filteredClient];

    if (sortFilter.value !== "sem-ordenação") {
        if (sortFilter.value === "name-a-z") {
            sortedClient.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortFilter.value === "name-z-a") {
            sortedClient.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (sortFilter.value === "salary-low-high") {
            sortedClient.sort((a, b) => a.salary - b.salary);
        }

        if (sortFilter.value === "salary-high-low") {
            sortedClient.sort((a, b) => b.salary - a.salary);
        }
    }
    
    updateScreen(sortedClient);
    appliedFilters();    
}

// Filter Events
cityFilter.addEventListener("change", applyFilters);
professionFilter.addEventListener("change", applyFilters);
activeFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);

clearFiltersButton.addEventListener("click", () => {
    clearFilters(true)
});


// ==========================================
// 4. CONTEXT: SCREEN RENDERING (UI)
// ==========================================

// Elementos do DOM da Listagem e Cards/Tags
const clientList = document.querySelector(".client-list");
const totalClient = document.querySelector(".total-client");
const totalSalaries = document.querySelector(".total-salaries");
const totalActiveClient = document.querySelector(".total-active-client");

const appliedCityBox = document.querySelector(".applied-city-box");
const appliedProfessionBox = document.querySelector(".applied-profession-box");
const appliedActiveBox = document.querySelector(".applied-active-box");
const appliedSortBox = document.querySelector(".applied-sort-box");

const appliedCity = document.querySelector(".applied-city");
const appliedProfession = document.querySelector(".applied-profession");
const appliedActive = document.querySelector(".applied-active");
const appliedSort = document.querySelector(".applied-sort");
const deleteFilterButton = document.querySelectorAll(".delete-filter");

// Visual Interface (UI) Functions
function appliedFilters() {
    if (cityFilter.value !== "all") {
        appliedCity.textContent = cityFilter.value;
        appliedCityBox.classList.add("active");
    } else {
        appliedCityBox.classList.remove("active");
    }

    if (professionFilter.value !== "all") {
        appliedProfession.textContent = professionFilter.value;
        appliedProfessionBox.classList.add("active");
    } else {
        appliedProfessionBox.classList.remove("active");
    }

    if (sortFilter.value !== "sem-ordenacao") {
        appliedSort.textContent = sortFilter.value;
        appliedSortBox.classList.add("active");
    } else {
        appliedSortBox.classList.remove("active");
    }

    if (activeFilter.checked) {
        appliedActive.textContent = "Ativos"
        appliedActiveBox.classList.add("active");
    } else {
        appliedActiveBox.classList.remove("active");
    }
}

deleteFilterButton.forEach(button => {
    button.addEventListener("click", () => {
        const daddyContainer = button.closest(".applied-filter")

        if(daddyContainer.classList.contains("applied-city-box")) {

            daddyContainer.classList.remove("active")
            clearFilters(false, "city")
            
        } else if (daddyContainer.classList.contains("applied-profession-box")){
            daddyContainer.classList.remove("active")
            clearFilters(false, "profession")

        } else if (daddyContainer.classList.contains("applied-active-box")){
            daddyContainer.classList.remove("active")
            clearFilters(false, "active")

        } else if (daddyContainer.classList.contains("applied-sort-box")){
            daddyContainer.classList.remove("active")
            clearFilters(false, "sort")
        }
    })
})

function updateScreen(clientList) {
    renderPeople(clientList);
    calculateSalaries(clientList);
    updatePeopleCount(clientList);
    countActivePeople(clientList);
}

function renderPeople(clientToRender) {
    clientList.innerHTML = "";

    clientToRender.forEach((client, index) => {
        const tableRow = document.createElement("tr");

        const nameCell = document.createElement("td");
        const ageCell = document.createElement("td");
        const cityCell = document.createElement("td");
        const professionCell = document.createElement("td");
        const salaryCell = document.createElement("td");
        const activeCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        nameCell.textContent = client.name;
        ageCell.textContent = client.age;
        cityCell.textContent = client.city;
        professionCell.textContent = client.profession;
        salaryCell.textContent = client.salary;
        activeCell.textContent = client.active ? "Sim" : "Não";

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
                applyFilters();
            }
        });

        editButton.addEventListener("click", () => {
            const clientToEdit = clientToRender[index];
            editClient(clientToEdit);
            openForm();
        });

        actionsCell.append(editButton, removeButton);
        tableRow.append(nameCell, ageCell, cityCell, professionCell, salaryCell, activeCell, actionsCell);
        clientList.append(tableRow);
    });
}


function calculateSalaries(clientList) {

    const total = clientList.reduce(
        (accumulator, client) => accumulator + client.salary,
        0
    );

    totalSalaries.textContent = `Salário total: R$${total}`;
}

function updatePeopleCount(clientList) {

    totalClient.textContent = `Clientes: ${clientList.length}`;
};

function countActivePeople(clientList) {

    const activeClient = clientList.filter(
        client => client.active
    );

    totalActiveClient.textContent = `Ativos: ${activeClient.length}`;
};



