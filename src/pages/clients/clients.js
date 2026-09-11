import { getClientsLs } from "./services/client-storage";
import { saveClientsLs } from "./services/client-storage";
import { initClientForm } from "./components/client-form";
import { initFilters } from "./components/client-filters";

export async function clientsPage() {
  const response = await fetch("./src/pages/clients/clients.html");

  return await response.text();
}

export function initClients() {

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

    renderClients(pageClients, startIndex);

    updateTablePageCount();
  }

  function renderClients(clientToRender, startIndex) {
    clientList.innerHTML = "";

    clientToRender.forEach((client, index) => {

      const tableRow = document.createElement("tr");

      const cells = {
        id: startIndex + index + 1,
        name: client.name,
        email: client.email,
        phone: client.phone,
        city: client.city,
        status: client.status ? "Ativo" : "Inativo",
      }

      Object.values(cells).forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        tableRow.append(cell);
      })

      const actionsCell = document.createElement("td");

      actionsCell.append(
        createActionButton("edit-client-symbol", "edit"),
        createActionButton("delete-client-symbol", "delete"),
        createActionButton("info-client-symbol", "visibility")
      )

      tableRow.append(actionsCell)

      function createActionButton(symbolClass, icon) {
        const button = document.createElement("button");
        button.classList.add("table-action-button");
        button.innerHTML = `<span class="material-symbols-outlined ${symbolClass}">${icon}</span>`
        return button
      }

      const delClientButton = actionsCell.querySelector(".delete-client-symbol")
      const editClientButton = actionsCell.querySelector(".edit-client-symbol")
      // Internal events of the table buttons
      delClientButton.addEventListener("click", async () => {
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

      editClientButton.addEventListener("click", () => {
        const clientToEdit = clientToRender[index];
        editClient(clientToEdit);

        openForm();
      });

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

      updateScreen(clients);
    }
  });

  previousTable.addEventListener("click", () => {
    if (startIndex > 0) {
      startIndex -= lastIndex;

      updateScreen(clients);
    }
  });

  updateScreen(clients);
}
