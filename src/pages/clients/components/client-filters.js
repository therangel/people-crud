import { getStates } from "../../../services/ibge-service";

let clientsToDisplay = [];

let statesGroup = [];
let statusGroup = null;
let sortGroup = null;
let searchTerm = "";

const statesName = await getStates()

export function initFilters(onChangeFilter) {
  
  const stateFilter = document.getElementById("state-filter");
  const statusFilter = document.getElementById("status-filter");
  const sortFilter = document.getElementById("sort-filter");
  const clearFiltersButton = document.querySelector(".clear-filters-button");
  const search = document.querySelector(".table-search");
  const appliedFilterList = document.querySelector(".applied-filter-list");

  // ==========================================
  // 5. FILTERS
  // ==========================================

  function renderStates(){

    statesName.forEach(state => {
      const stateOption = document.createElement("option");
      stateOption.setAttribute("value", state.stateCode)
      stateOption.textContent = state.name

      stateFilter.append(stateOption)
    })
 
  }

  renderStates()

  function searchClients(currentText) {
    searchTerm = currentText.toLowerCase();

    // indexInicial = 0;
    onChangeFilter();
  }

  function handleStateFilter() {
    const selectedState = stateFilter.value;

    if (selectedState === "all") {
      return;
    }

    if (!statesGroup.includes(selectedState)) {
      statesGroup.push(selectedState);
    }

    stateFilter.value = "all";

    onChangeFilter();
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

    onChangeFilter();
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

    onChangeFilter();
  }

  function clearFilters() {
    statesGroup = [];
    statusGroup = null;
    sortGroup = null;
    searchTerm = ""

    stateFilter.value = "all";
    statusFilter.value = "all";
    sortFilter.value = "no-sort";
    search.value = ""

    onChangeFilter();
  }

  function applyFilters(clients) {

    clientsToDisplay = [...clients];

    if (searchTerm !== "") {
      clientsToDisplay = clientsToDisplay.filter((client) => {
        return Object.values(client).some((value) =>
          String(value).toLowerCase().startsWith(searchTerm),
        );
      });
    }

    if (statesGroup.length > 0) {

      const selectedState = statesName.filter((state) => statesGroup.includes(state.stateCode))

      console.log(selectedState)
      console.log(clientsToDisplay)
      clientsToDisplay = clientsToDisplay.filter((client) => {

          const teste = selectedState.map(state => state.name)
          return teste.includes(client.state)    
           
      })

      // startIndex = 0;
    }

    if (statusGroup !== null) {
      clientsToDisplay = clientsToDisplay.filter(
        (client) => client.status === statusGroup,
      );
      // startIndex = 0;
    }

    if (sortGroup === "name-a-z") {
      clientsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
      // startIndex = 0;
    }

    if (sortGroup === "name-z-a") {
      clientsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
      // startIndex = 0;
    }

    appliedFilters();

    return clientsToDisplay;
  }

  function renderAppliedFilter(text, onDelete) {
    const filterBox = document.createElement("div");

    const deleteFilter = document.createElement("button");
    deleteFilter.classList.add("delete-filter");
    deleteFilter.textContent = `X`;

    const filterText = document.createElement("span");
    
    filterText.textContent = text

    filterBox.append(deleteFilter, filterText);
    appliedFilterList.append(filterBox);

    deleteFilter.addEventListener("click", () => {
      onDelete();
      onChangeFilter();
    });
  }

  function appliedFilters() {
    // startIndex = 0;
    appliedFilterList.textContent = "";

    statesGroup.forEach((state, index) => {
      renderAppliedFilter(state, () => {
        statesGroup.splice(index, 1);
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

  stateFilter.addEventListener("change", handleStateFilter);
  statusFilter.addEventListener("change", handleStatusFilter);
  sortFilter.addEventListener("change", handleSortFilter);

  clearFiltersButton.addEventListener("click", clearFilters);


  return { applyFilters }
}
