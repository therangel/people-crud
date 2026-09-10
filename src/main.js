import { sideBar } from "./components/sidebar.js";
import { router } from "./router.js"; // Return HTML of the current Page
import { initClients } from "./pages/clients/clients.js";
// import { initHome } from './pages/home/home.js';

const mainContent = document.getElementById("main"); // Where does the HTML file go
const links = document.querySelectorAll("[data-route]");

function updateActiveLink() {
  const path = window.location.pathname;

  links.forEach((link) => {
    const href = link.getAttribute("href");

    const isHome = href === "/home" && (path === "/" || path === "/home");

    link.classList.toggle("active", href === path || isHome);
  });
}

async function render() {
  mainContent.innerHTML = await router(); //The `main` element receives the HTML of the current page.

  if (window.location.pathname === "/clients") {
    initClients(); //init page logic
  }

  updateActiveLink();
}

window.addEventListener("popstate", render);

sideBar(render);
render();
