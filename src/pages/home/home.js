import homeHtml from "./home.html?raw";
import { getClientsLs } from "../services/client-storage";

export async function homePage() {
  return homeHtml;
}


export function initHome() {
  const clientsList = getClientsLs()
  
  const totalClients = clientsList.length
  const activeClients = clientsList.filter(client => client.status).length
  const inactiveClients = clientsList.filter(client => !client.status).length

  document.getElementById("total-clients").textContent = totalClients;
  document.getElementById("active-clients").textContent = activeClients;
  document.getElementById("inactive-clients").textContent = inactiveClients;
  
}

