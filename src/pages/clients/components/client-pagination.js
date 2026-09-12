export function initPagination(renderClients, onChangePagination) {
    
  const tableControl = document.querySelector(".table-control");
  const previousTable = document.querySelector(".previous");
  const nextTable = document.querySelector(".next");
  const pageNumbers = document.querySelector(".page-number-group");

  let startIndex = 0;
  let lastIndex = 10;
  let numbers;
  let clientsToDisplay = []

  function renderTablePage(clientsToRender) {
    const clientPorPage = clientsToRender.slice(
      startIndex,
      startIndex + lastIndex,
    );

    clientsToDisplay = clientsToRender

    renderClients(clientPorPage, startIndex);

    updateTablePageCount();
  }

  function updateTablePageCount() {
    const tablePageCount = document.querySelector(".table-page-count");
    tablePageCount.textContent = "";

    let pageTotal =
      startIndex + lastIndex - 1 > clientsToDisplay.length
        ? clientsToDisplay .length
        : lastIndex + startIndex;

    tablePageCount.textContent = `Mostrando ${startIndex + 1} - ${pageTotal} de ${clientsToDisplay.length}`;

    tableControl.prepend(tablePageCount);
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

  nextTable.addEventListener("click", () => {
    if (startIndex + lastIndex < clientsToDisplay.length) {
      startIndex += lastIndex;

      onChangePagination(clientsToDisplay);
    }
  });

  previousTable.addEventListener("click", () => {
    if (startIndex > 0) {
      startIndex -= lastIndex;

      onChangePagination(clientsToDisplay);
    }
  });

  return { renderTablePage, pageNumbersControl }
}
