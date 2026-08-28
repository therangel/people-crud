// ==========================================
// 1. GLOBAL STATE OF DATA
// ==========================================
// Data shared across the entire application
const people = [];


// ==========================================
// 2. CONTEXT: FORM AND MODAL (CLIENTS)
// ==========================================

// DOM Elements and Control Variables
const openFormButton = document.querySelector(".add-client-button");
const modalForm = document.querySelector(".modal-form");
const closeFormButton = document.querySelector(".close-modal-button");

const personForm = document.querySelector(".person-form");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const cityInput = document.getElementById("city");
const professionInput = document.getElementById("profession");
const salaryInput = document.getElementById("salary");
const activeInput = document.getElementById("active");
const addButton = document.querySelector(".form-submit-button");

let mode = "add"; // Internal form state: "add" or "save"
let personBeingEdited = null;

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
    personBeingEdited = null;
    mode = "add";
    addButton.textContent = "Adicionar";
}

function addPerson() {
    const person = {
        id: crypto.randomUUID(),
        name: nameInput.value.trim(),
        age: Number(ageInput.value),
        city: cityInput.value.trim(),
        profession: professionInput.value.trim(),
        salary: Number(salaryInput.value),
        active: activeInput.checked
    };

    people.push(person);
    clearForm();
    applyFilters();
}

function editPerson(person) {
    nameInput.value = person.name;
    ageInput.value = person.age;
    cityInput.value = person.city;
    professionInput.value = person.profession;
    salaryInput.value = person.salary;
    activeInput.checked = person.active;

    addButton.textContent = "Salvar";
    personBeingEdited = person;
    mode = "save";
}

function savePerson(person) {
    person.name = nameInput.value;
    person.age = Number(ageInput.value);
    person.city = cityInput.value;
    person.profession = professionInput.value;
    person.salary = Number(salaryInput.value);
    person.active = activeInput.checked;

    applyFilters();
    resetForm();
}

// Form Events
openFormButton.addEventListener("click", () => {
    resetForm();
    openForm();
});

closeFormButton.addEventListener("click", closeForm);

personForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (mode === "add") {
        addPerson();
        closeForm();
    } else if (mode === "save") {
        savePerson(personBeingEdited);
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
function clearFilters() {
    cityFilter.value = "todas";
    professionFilter.value = "todas";
    activeFilter.checked = false;
    sortFilter.value = "sem-ordenacao";

    applyFilters();
}

function applyFilters() {
    let filteredPeople = people;

    if (cityFilter.value !== "todas") {
        filteredPeople = filteredPeople.filter(
            person => person.city === cityFilter.value 
        );       
    }

    if (professionFilter.value !== "todas") {
        filteredPeople = filteredPeople.filter(
            person => person.profession === professionFilter.value
        );
    }

    if (activeFilter.checked) {
        filteredPeople = filteredPeople.filter(
            person => person.active
        );
    }

    const sortedPeople = [...filteredPeople];

    if (sortFilter.value !== "sem-ordenação") {
        if (sortFilter.value === "name-a-z") {
            sortedPeople.sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortFilter.value === "name-z-a") {
            sortedPeople.sort((a, b) => b.name.localeCompare(a.name));
        }

        if (sortFilter.value === "salary-low-high") {
            sortedPeople.sort((a, b) => a.salary - b.salary);
        }

        if (sortFilter.value === "salary-high-low") {
            sortedPeople.sort((a, b) => b.salary - a.salary);
        }
    }
    
    updateScreen(sortedPeople);
    appliedFilters();    
}

// Filter Events
cityFilter.addEventListener("change", applyFilters);
professionFilter.addEventListener("change", applyFilters);
activeFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);
clearFiltersButton.addEventListener("click", clearFilters);


// ==========================================
// 4. CONTEXT: SCREEN RENDERING (UI)
// ==========================================

// Elementos do DOM da Listagem e Cards/Tags
const peopleList = document.querySelector(".people-list");
const totalPeople = document.querySelector(".total-people");
const totalSalaries = document.querySelector(".total-salaries");
const totalActivePeople = document.querySelector(".total-active-people");

const appliedCityBox = document.querySelector(".applied-city-box");
const appliedProfessionBox = document.querySelector(".applied-profession-box");
const appliedSortBox = document.querySelector(".applied-sort-box");
const appliedCity = document.querySelector(".applied-city");
const appliedProfession = document.querySelector(".applied-profession");
const appliedSort = document.querySelector(".applied-sort");

// Visual Interface (UI) Functions
function appliedFilters() {
    if (cityFilter.value !== "todas") {
        appliedCity.textContent = cityFilter.value;
        appliedCityBox.classList.add("active");
    } else {
        appliedCityBox.classList.remove("active");
    }

    if (professionFilter.value !== "todas") {
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
}

function updateScreen(peopleList) {
    renderPeople(peopleList);
    calculateSalaries(peopleList)
    updatePeopleCount(peopleList)
    countActivePeople(peopleList)
}

function renderPeople(peopleToRender) {
    peopleList.innerHTML = "";

    peopleToRender.forEach((person, index) => {
        const tableRow = document.createElement("tr");

        const nameCell = document.createElement("td");
        const ageCell = document.createElement("td");
        const cityCell = document.createElement("td");
        const professionCell = document.createElement("td");
        const salaryCell = document.createElement("td");
        const activeCell = document.createElement("td");
        const actionsCell = document.createElement("td");

        nameCell.textContent = person.name;
        ageCell.textContent = person.age;
        cityCell.textContent = person.city;
        professionCell.textContent = person.profession;
        salaryCell.textContent = person.salary;
        activeCell.textContent = person.active ? "Sim" : "Não";

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";

        // Internal events of the table buttons
        removeButton.addEventListener("click", () => {
            const personIndex = people.findIndex(
                currentPerson => currentPerson.id === person.id
            );

            if (personIndex !== -1) {
                people.splice(personIndex, 1);
                applyFilters();
            }
        });

        editButton.addEventListener("click", () => {
            const personToEdit = peopleToRender[index];
            editPerson(personToEdit);
            openForm();
        });

        actionsCell.append(editButton, removeButton);
        tableRow.append(nameCell, ageCell, cityCell, professionCell, salaryCell, activeCell, actionsCell);
        peopleList.append(tableRow);
    });
}


function calculateSalaries(peopleList) {

    const total = peopleList.reduce(
        (accumulator, person) => accumulator + person.salary,
        0
    )

    totalSalaries.textContent = `Salário total: R$${total}`
}

function updatePeopleCount(peopleList) {

    totalPeople.textContent = `Clientes: ${peopleList.length}`
}

function countActivePeople(peopleList) {

    const activePeople = peopleList.filter(
        person => person.active
    )

    totalActivePeople.textContent = `Ativos: ${activePeople.length}`
}