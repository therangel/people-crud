import { sideBar } from './components/sidebar.js'
import { router } from './router.js';
import { initClients } from './pages/clients/clients.js';


const mainContent = document.querySelector('#main');

function updateActiveLink() {
    document.querySelectorAll('[data-route]').forEach(link => {
        link.classList.toggle(
            'active',
            link.getAttribute('href') === window.location.pathname
        );
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



