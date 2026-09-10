import { homePage } from './pages/home/home.js'; // Page html in text format
import { clientsPage } from './pages/clients/clients.js'; // Page html in text format



export async function router() {
    const path = window.location.pathname;

    switch(path) {
        case '/':
        case '/home':
            return await homePage();
            
        case '/clients':
            return await clientsPage();

        default:
            return '<h1>Página não encontrada</h1>';
    }
}