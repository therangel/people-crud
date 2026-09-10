import { sideBar } from './components/sidebar.js'
import { router } from './router.js';
import { initClients } from './pages/clients/clients.js';


const mainContent = document.querySelector('#main');

function updateActiveLink() {

    const path = window.location.pathname;

    const links = document.querySelectorAll('[data-route]')

    links.forEach(link => {

        const href = link.getAttribute('href')

        const isHome = href === "/home" && (path === '/' || path === '/home')

        link.classList.toggle('active', href === path || isHome)
        
    });
}

async function render() {
    mainContent.innerHTML = await router();

    if(window.location.pathname === '/clients') {
      initClients();
    }

    updateActiveLink();
}


document.querySelectorAll('[data-route]').forEach(link => {

    link.addEventListener('click', event => {

        event.preventDefault();
        
        const url = link.getAttribute('href');

        history.pushState({}, '', url);

        render();
    });
});

window.addEventListener('popstate', render);

sideBar();
render();



