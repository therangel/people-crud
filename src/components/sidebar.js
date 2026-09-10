
export function sideBar(render){
    const menuButton = document.getElementById("burger-btn")
    const sidebar = document.querySelector(".sidebar")
    const overlay = document.querySelector(".overlay")
    const collapseSidebarButton = document.querySelector(".collapse-sidebar")
    const closeSidebarButton = document.querySelector(".close-sidebar")
    const navLinks = document.querySelectorAll(".nav-link")

    function openSidebar() {
        sidebar.classList.add("active")
        overlay.classList.add("active")
    }

    function closeSidebar() {
        sidebar.classList.remove("active")
        overlay.classList.remove("active")
    }

    function collapseSidebar() {
        sidebar.classList.toggle("collapsed")
        collapseSidebarButton.classList.toggle("collapsed")
    }


    menuButton.addEventListener("click", openSidebar)

    overlay.addEventListener("click", closeSidebar)
    closeSidebarButton.addEventListener("click", closeSidebar)

    navLinks.forEach(link => {

        link.addEventListener('click', event => {
            event.preventDefault();
            
            closeSidebar();

            const url = link.getAttribute('href');

            history.pushState({}, '', url);

            render();
        });
    });

    collapseSidebarButton.addEventListener("click", collapseSidebar)
    
}








