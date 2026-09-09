import { homePage } from './pages/home/home.js';
import { clientsPage } from './pages/clients/clients.js';



export async function router() {
    const path = window.location.pathname;

    switch(path) {
        case '/':
            return await homePage();

        case '/clients':
            return await clientsPage();

        case '/home':
            return await homePage();
            
        default:
            return '<h1>Página não encontrada</h1>';
    }
}