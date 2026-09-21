import clientsHtml from "./clients.html?raw";
import { getClientsLs, saveClientsLs } from "../services/client-storage";
import { initClientForm } from "./components/client-form";
import { initFilters } from "./components/client-filters";
import { initCLientTable } from "./components/client-table";
import { initPagination } from "./components/client-pagination";
import { initConfirmationModal } from "./components/confirmation-modal";

export async function clientsPage() {
  return clientsHtml;
}

export function initClients() {
  const clients = getClientsLs(); //DATA LOCAL-STORAGE
  console.log(clients)
  let clientsToDisplay = [];

  const totalClient = document.querySelector(".total-client");
  const totalActiveClient = document.querySelector(".total-active-client");

  const { applyFilters } = initFilters(() => updateScreen(clients));

  const { editClient, openForm } = initClientForm(clients, saveClientsLs, () =>
    updateScreen(clients),
  );
  const { confirm } = initConfirmationModal();

  const { renderClients } = initCLientTable(
    clients,
    editClient,
    openForm,
    confirm,
    saveClientsLs,
    () => updateScreen(clients),
  );

  const { renderTablePage, pageNumbersControl } = initPagination(
    renderClients,
    () => updateScreen(clients),
  );

  
  function updateClientCount() {
    totalClient.textContent = `Clientes: ${clientsToDisplay.length}`;
  }


  function countActivePeople() {
    const activeClients = clientsToDisplay.filter(
      (client) => client.status,
    ).length;
    totalActiveClient.textContent = `Ativos: ${activeClients}`;
  }

  function updateScreen(clients) {
    clientsToDisplay = applyFilters(clients);

    renderTablePage(clientsToDisplay);
    pageNumbersControl();
    updateClientCount();
    countActivePeople();
  }

  updateScreen(clients);

}
