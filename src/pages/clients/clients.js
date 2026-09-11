import { getClientsLs } from "./services/client-storage";
import { saveClientsLs } from "./services/client-storage";
import { initClientForm } from "./components/client-form";
import { initFilters } from "./components/client-filters";

export async function clientsPage() {
  const response = await fetch("./src/pages/clients/clients.html");

  return await response.text();
}

export function initClients() {
  // ==========================================
  // 1. GLOBAL STATE
  // ==========================================

  const clients = getClientsLs(); //DATA LOCAL-STORAGE

  let startIndex = 0;
  let lastIndex = 10;
  let numbers;
  let clientsToDisplay = [];

  const clientList = document.querySelector(".client-list");

  const { applyFilters } = initFilters(() => updateScreen(clients));

  const { editClient, openForm } = initClientForm(clients, saveClientsLs, () =>
    updateScreen(clients),
  );

  function updateScreen(clients) {
    clientsToDisplay = applyFilters(clients);

    renderTablePage(clientsToDisplay);

    pageNumbersControl();
    updatePeopleCount();
    countActivePeople();
  }

  // ==========================================
  // 2. DOM ELEMENTS
  // ==========================================

  // List / counters
  const modalOverlay = document.querySelector(".overlay");
  const totalClient = document.querySelector(".total-client");
  const totalActiveClient = document.querySelector(".total-active-client");

  //Table
  const tableControl = document.querySelector(".table-control");
  const previousTable = document.querySelector(".previous");
  const nextTable = document.querySelector(".next");
  const pageNumbers = document.querySelector(".page-number-group");
  const confirmationModalContainer = document.querySelector(
    ".confirmation-modal",
  );

  function renderTablePage(clientsToDisplay) {
    const pageClients = clientsToDisplay.slice(
      startIndex,
      startIndex + lastIndex,
    );

    renderPeople(pageClients, startIndex);

    updateTablePageCount();
  }

  function renderPeople(clientToRender, startIndex) {
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

      idCell.textContent = startIndex + index + 1;
      nameCell.textContent = client.name;
      emailCell.textContent = client.email;
      phoneCell.textContent = client.phone;
      cityCell.textContent = client.city;
      statusCell.textContent = client.status ? "Ativo" : "Inativo";

      const removeButton = document.createElement("button");
      removeButton.classList.add("table-action-button");
      removeButton.innerHTML = `<span class="material-symbols-outlined delete-client-symbol">delete</span>`;

      const editButton = document.createElement("button");
      editButton.classList.add("table-action-button");
      editButton.innerHTML = `<span class="material-symbols-outlined edit-client-symbol">edit</span>`;

      const moreInfoButton = document.createElement("button");
      moreInfoButton.classList.add("table-action-button");
      moreInfoButton.innerHTML = `<span class="material-symbols-outlined info-client-symbol">visibility</span>`;

      // Internal events of the table buttons
      removeButton.addEventListener("click", async () => {
        const response = await confirmationModal();

        if (response) {
          const personIndex = clients.findIndex(
            (currentPerson) => currentPerson.id === client.id,
          );

          if (personIndex !== -1) {
            clients.splice(personIndex, 1);

            saveClientsLs(clients); // attention!!!
            updateScreen(clients);
          }
        } else {
          return;
        }
      });

      editButton.addEventListener("click", () => {
        const clientToEdit = clientToRender[index];
        editClient(clientToEdit);

        openForm();
      });

      actionsCell.append(editButton, removeButton, moreInfoButton);
      tableRow.append(
        idCell,
        nameCell,
        emailCell,
        phoneCell,
        cityCell,
        statusCell,
        actionsCell,
      );
      clientList.append(tableRow);
    });
  }

  function confirmationModal() {
    return new Promise((resolve) => {
      const cancelButton = document.querySelector(".cancel-button");
      const deleteButton = document.querySelector(".delete-button");

      confirmationModalContainer.classList.add("active");
      modalOverlay.classList.add("active");

      cancelButton.onclick = () => {
        confirmationModalContainer.classList.remove("active");
        modalOverlay.classList.remove("active");
        resolve(false);
      };

      deleteButton.onclick = () => {
        confirmationModalContainer.classList.remove("active");
        modalOverlay.classList.remove("active");
        resolve(true);
      };
    });
  }

  function closeConfirmationModal() {
    confirmationModalContainer.classList.remove("active");
  }

  function updateTablePageCount() {
    const tablePageCount = document.querySelector(".table-page-count");
    tablePageCount.textContent = "";

    let pageTotal =
      startIndex + lastIndex - 1 > clientsToDisplay.length
        ? clientsToDisplay.length
        : lastIndex + startIndex;

    tablePageCount.textContent = `Mostrando ${startIndex + 1} - ${pageTotal} de ${clientsToDisplay.length}`;

    tableControl.prepend(tablePageCount);
  }

  function updatePeopleCount() {
    totalClient.textContent = `Clientes: ${clientsToDisplay.length}`;
  }

  function countActivePeople() {
    const activeClient = clientsToDisplay.filter(
      (client) => client.status,
    ).length;
    totalActiveClient.textContent = `Ativos: ${activeClient}`;
  }

  function pageNumbersControl() {
    const pages =
      clientsToDisplay.length % 10 > 0
        ? Math.ceil(clientsToDisplay.length / 10)
        : clientsToDisplay.length / 10;

    numbers = Array.from({ length: pages }, (_, i) => i + 1);

    renderPageNumbers();
  }

  function renderPageNumbers() {
    pageNumbers.textContent = "";

    const currentPage = Math.floor(startIndex / lastIndex) + 1;

    numbers.forEach((number) => {
      const pageNumber = document.createElement("span");
      pageNumber.textContent = number;
      pageNumber.classList.add("page-number");

      if (number === currentPage) {
        pageNumber.classList.add("active");
      }

      pageNumbers.append(pageNumber);
    });
  }

  modalOverlay.addEventListener("click", () => {
    if (confirmationModalContainer.classList.contains("active")) {
      closeConfirmationModal();
    }
  });

  nextTable.addEventListener("click", () => {
    if (startIndex + lastIndex < clientsToDisplay.length) {
      startIndex += lastIndex;

      updateScreen(clientsToDisplay);
    }
  });

  previousTable.addEventListener("click", () => {
    if (startIndex > 0) {
      startIndex -= lastIndex;

      updateScreen(clientsToDisplay);
    }
  });

  updateScreen(clients);
}
