let cityGroup = [];
let statusGroup = null;
let sortGroup = null;

const cityFilter = document.getElementById("city-filter");
const statusFilter = document.getElementById("status-filter");
const sortFilter = document.getElementById("sort-filter");
const clearFiltersButton = document.querySelector(".clear-filters-button");
const search = document.querySelector(".table-search");

// ==========================================
// 5. FILTERS
// ==========================================

function searchClients(currentText) {
  searchTerm = currentText.toLowerCase();

  indexInicial = 0;
  applyFilters();
}

function handleCityFilter() {
  const selectedCity = cityFilter.value;

  if (selectedCity === "all") {
    return;
  }

  if (!cityGroup.includes(selectedCity)) {
    cityGroup.push(selectedCity);
  }

  cityFilter.value = "all";

  applyFilters();
}

function handleStatusFilter() {
  const selectedStatus = statusFilter.value;

  if (selectedStatus === "all") {
    return;
  }

  statusGroup = null;

  if (selectedStatus === "actives") {
    statusGroup = true;
  }

  if (selectedStatus === "inactives") {
    statusGroup = false;
  }

  statusFilter.value = "all";

  applyFilters();
}

function handleSortFilter() {
  const selectedSort = sortFilter.value;

  if (selectedSort === "no-sort") {
    return;
  }

  sortGroup = null;

  if (selectedSort === "name-a-z") {
    sortGroup = "name-a-z";
  }

  if (selectedSort === "name-z-a") {
    sortGroup = "name-z-a";
  }

  sortFilter.value = "no-sort";

  applyFilters();
}

function clearFilters() {
  cityGroup = [];
  statusGroup = null;
  sortGroup = null;

  cityFilter.value = "all";
  statusFilter.value = "all";
  sortFilter.value = "no-sort";

  applyFilters();
}

function applyFilters() {
  clientsToDisplay = [...clients];

  if (searchTerm !== "") {
    clientsToDisplay = clientsToDisplay.filter((client) => {
      return Object.values(client).some((value) =>
        String(value).toLowerCase().startsWith(searchTerm),
      );
    });
  }

  if (cityGroup.length > 0) {
    clientsToDisplay = clientsToDisplay.filter((client) =>
      cityGroup.includes(client.city),
    );
    startIndex = 0;
  }

  if (statusGroup !== null) {
    clientsToDisplay = clientsToDisplay.filter(
      (client) => client.status === statusGroup,
    );
    startIndex = 0;
  }

  if (sortGroup === "name-a-z") {
    clientsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    startIndex = 0;
  }

  if (sortGroup === "name-z-a") {
    clientsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
    startIndex = 0;
  }

  updateScreen();
  appliedFilters();
}

function renderAppliedFilter(text, onDelete) {
  const filterBox = document.createElement("div");
  // appliedCityBox.classList.add("applied-city-box");

  const deleteFilter = document.createElement("button");
  deleteFilter.classList.add("delete-filter");
  deleteFilter.textContent = `X`;

  const filterText = document.createElement("span");
  // appliedCity.classList.add("applied-city")
  filterText.textContent = text;

  filterBox.append(deleteFilter, filterText);
  appliedFilterList.append(filterBox);

  deleteFilter.addEventListener("click", () => {
    onDelete();
    // filterBox.remove();
    applyFilters();
  });
}

function appliedFilters() {
  startIndex = 0;
  appliedFilterList.textContent = "";

  cityGroup.forEach((city, index) => {
    renderAppliedFilter(city, () => {
      cityGroup.splice(index, 1);
    });
  });

  if (statusGroup !== null) {
    renderAppliedFilter(statusGroup ? "Ativos" : "Inativos", () => {
      statusGroup = null;
    });
  }

  if (sortGroup !== null) {
    renderAppliedFilter(
      sortGroup === "name-a-z" ? "Nome: A → Z" : "Nome: Z → A",
      () => {
        sortGroup = null;
      },
    );
  }
}

search.addEventListener("input", (event) => {
  const currentText = event.target.value;
  searchClients(currentText);
});

cityFilter.addEventListener("change", handleCityFilter);
statusFilter.addEventListener("change", handleStatusFilter);
sortFilter.addEventListener("change", handleSortFilter);

clearFiltersButton.addEventListener("click", clearFilters);
