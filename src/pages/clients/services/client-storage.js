export function getClients() {
    return JSON.parse(localStorage.getItem("clients")) || [];
}

export function saveClients(clients) {
    localStorage.setItem("clients", JSON.stringify(clients));
}