const menuButton = document.getElementById("burger-btn")
const sidebar = document.querySelector(".sidebar")
const overlay = document.querySelector(".overlay")
const closeSidebarButton = document.querySelector(".close-sidebar")
const openSidebarButton = document.querySelector(".open-sidebar")


function toggleMenu() {
    sidebar.classList.toggle("active")
    menuButton.classList.toggle("active")
    overlay.classList.toggle("active")
}

function closeMenu() {
    sidebar.classList.remove("active")
    menuButton.classList.remove("active")
    overlay.classList.remove("active")
}

function toggleSidebar() {
    sidebar.classList.toggle("clicked")
    closeSidebarButton.classList.toggle("clicked")
}


menuButton.addEventListener("click", toggleMenu)
overlay.addEventListener("click", closeMenu)

closeSidebarButton.addEventListener("click", toggleSidebar)



