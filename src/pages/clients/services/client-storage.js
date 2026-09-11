export function getClientsLs() {
    return JSON.parse(localStorage.getItem("clients")) || [];
}

export function saveClientsLs(clients) {
    localStorage.setItem("clients", JSON.stringify(clients));
}