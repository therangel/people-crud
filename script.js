// DOM Elements

const openFormButton = document.querySelector(".add-client-button")
const modalForm = document.querySelector(".modal-form")
const closeFormButton = document.querySelector(".close-modal-button")

const personForm = document.querySelector(".person-form")
const nameInput = document.getElementById("name")
const ageInput = document.getElementById("age")
const cityInput = document.getElementById("city")
const professionInput = document.getElementById("profession")
const salaryInput = document.getElementById("salary")
const activeInput = document.getElementById("active")
const addButton = document.querySelector(".form-submit-button")

const peopleList = document.querySelector(".people-list")

const cityFilter = document.getElementById("city-filter")
const professionFilter = document.getElementById("profession-filter")
const activeFilter = document.getElementById("active-filter")
const sortFilter = document.getElementById("sort-filter")

const totalPeople = document.querySelector(".total-people")
const totalSalaries = document.querySelector(".total-salaries")
const totalActivePeople = document.querySelector(".total-active-people")

const clearFiltersButton = document.querySelector(".clear-filters-button")


// Data

const people = []


// State

let mode = "add"
let personBeingEdited = null


// Events

personForm.addEventListener("submit", (event) => {
    event.preventDefault()

    if (mode === "add") {
        addPerson()
        closeForm()

    } else if (mode === "save") {
        savePerson(personBeingEdited)
        closeForm()
    }
})

openFormButton.addEventListener("click", openForm)

closeFormButton.addEventListener("click", closeForm)

cityFilter.addEventListener("change", applyFilters)
professionFilter.addEventListener("change", applyFilters)
activeFilter.addEventListener("change", applyFilters)
sortFilter.addEventListener("change", applyFilters)

clearFiltersButton.addEventListener("click", clearFilters)


// Form Functions

function openForm() {
    modalForm.classList.add("active")
}

function closeForm() {
    modalForm.classList.remove("active")
}

function addPerson() {

    const isNameDuplicated = people.some(
        person => person.name === nameInput.value
    )

    if (isNameDuplicated) {
        alert("Nome já existe")
        return
    }

    const person = {
        name: nameInput.value,
        age: Number(ageInput.value),
        city: cityInput.value,
        profession: professionInput.value,
        salary: Number(salaryInput.value),
        active: activeInput.checked
    }

    people.push(person)

    clearForm()
    applyFilters()
}

function editPerson(person) {

    nameInput.value = person.name
    ageInput.value = person.age
    cityInput.value = person.city
    professionInput.value = person.profession
    salaryInput.value = person.salary
    activeInput.checked = person.active

    addButton.textContent = "Salvar"

    personBeingEdited = person
    mode = "save"
}

function savePerson(person) {

    const isNameDuplicated = people.some(
        currentPerson =>
            currentPerson.name === nameInput.value &&
            currentPerson !== personBeingEdited
    )

    if (isNameDuplicated) {
        alert("Nome já existe!")
        return
    }

    person.name = nameInput.value
    person.age = Number(ageInput.value)
    person.city = cityInput.value
    person.profession = professionInput.value
    person.salary = Number(salaryInput.value)
    person.active = activeInput.checked

    applyFilters()

    personBeingEdited = null
    mode = "add"

    addButton.textContent = "Adicionar"

    clearForm()
}

function clearForm() {

    nameInput.value = ""
    ageInput.value = ""
    cityInput.value = ""
    professionInput.value = ""
    salaryInput.value = ""
    activeInput.checked = false
}


// Filter Functions

function clearFilters() {

    cityFilter.value = "todas"
    professionFilter.value = "todas"
    activeFilter.checked = false
    sortFilter.value = "sem-ordenacao"

    applyFilters()
}

function applyFilters() {

    let filteredPeople = people

    if (cityFilter.value !== "todas") {
        filteredPeople = filteredPeople.filter(
            person => person.city === cityFilter.value
        )
    }

    if (professionFilter.value !== "todas") {
        filteredPeople = filteredPeople.filter(
            person => person.profession === professionFilter.value
        )
    }

    if (activeFilter.checked) {
        filteredPeople = filteredPeople.filter(
            person => person.active
        )
    }

    const sortedPeople = [...filteredPeople]

    if (sortFilter.value === "name-a-z") {
        sortedPeople.sort(
            (a, b) => a.name.localeCompare(b.name)
        )
    }

    if (sortFilter.value === "name-z-a") {
        sortedPeople.sort(
            (a, b) => b.name.localeCompare(a.name)
        )
    }

    if (sortFilter.value === "salary-low-high") {
        sortedPeople.sort(
            (a, b) => a.salary - b.salary
        )
    }

    if (sortFilter.value === "salary-high-low") {
        sortedPeople.sort(
            (a, b) => b.salary - a.salary
        )
    }

    updateScreen(sortedPeople)
}


// UI Functions

function updateScreen(peopleList) {

    renderPeople(peopleList)
    calculateSalaries(peopleList)
    updatePeopleCount(peopleList)
    countActivePeople(peopleList)
}

function renderPeople(peopleToRender) {

    peopleList.innerHTML = ""

    peopleToRender.forEach((person, index) => {

        const tableRow = document.createElement("tr")

        const nameCell = document.createElement("td")
        const ageCell = document.createElement("td")
        const cityCell = document.createElement("td")
        const professionCell = document.createElement("td")
        const salaryCell = document.createElement("td")
        const activeCell = document.createElement("td")
        const actionsCell = document.createElement("td")

        nameCell.textContent = person.name
        ageCell.textContent = person.age
        cityCell.textContent = person.city
        professionCell.textContent = person.profession
        salaryCell.textContent = person.salary
        activeCell.textContent = person.active

        const removeButton = document.createElement("button")
        removeButton.textContent = "Remover"

        const editButton = document.createElement("button")
        editButton.textContent = "Editar"

        removeButton.addEventListener("click", () => {

            const personIndex = people.findIndex(
                currentPerson => currentPerson === person
            )

            if (personIndex !== -1) {
                people.splice(personIndex, 1)
                applyFilters()
            }
        })

        editButton.addEventListener("click", () => {

            const personToEdit = peopleToRender[index]

            editPerson(personToEdit)
            openForm()
        })

        actionsCell.append(removeButton, editButton)

        tableRow.append(
            nameCell,
            ageCell,
            cityCell,
            professionCell,
            salaryCell,
            activeCell,
            actionsCell
        )

        peopleList.append(tableRow)
    })
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