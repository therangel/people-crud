import homeHtml from "./home.html?raw";
import { getClientsLs } from "../services/client-storage";

export async function homePage() {
  return homeHtml;
}


export function initHome() {
  const clientsList = getClientsLs()
  // const activeClients = clientsList.filter(client => client.status)

  const totalClientsEl = document.querySelector(".total-clients");
  const activeClientsEl = document.querySelector(".active-clients");
 
  const countClients = document.createElement("span");
  countClients.classList.add("count-clients")
  countClients.textContent = `${clientsList.length}`;

  totalClientsEl.append(countClients)

}

