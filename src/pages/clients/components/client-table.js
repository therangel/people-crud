export function initCLientTable(clients, editClient, openForm, confirmationModal, saveClientsLs, updateScreen) {
  const clientList = document.querySelector(".client-list");

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
      };

      Object.values(cells).forEach((value) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        tableRow.append(cell);
      });

      const actionsCell = document.createElement("td");

      actionsCell.append(
        createActionButton("edit-client-symbol", "edit"),
        createActionButton("delete-client-symbol", "delete"),
        createActionButton("info-client-symbol", "visibility"),
      );

      tableRow.append(actionsCell);

      const delClientButton = actionsCell.querySelector(
        ".delete-client-symbol",
      );
      const editClientButton = actionsCell.querySelector(".edit-client-symbol");

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

  function createActionButton(symbolClass, icon) {
    const button = document.createElement("button");
    button.classList.add("table-action-button");
    button.innerHTML = `<span class="material-symbols-outlined ${symbolClass}">${icon}</span>`;
    return button;
  }

  return { renderClients };
}
