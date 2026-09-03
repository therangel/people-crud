const menuButton = document.getElementById("burger-btn")
const sidebar = document.querySelector(".sidebar")
const overlay = document.querySelector(".overlay")
const collapseSidebarButton = document.querySelector(".collapse-sidebar")
// const openSidebarButton = document.querySelector(".open-sidebar")
const homePageLink = document.querySelector(".home")
const clientPageLink = document.querySelector(".client")


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

    sidebar.classList.toggle("collapsed")
    collapseSidebarButton.classList.toggle("collapsed")
}


menuButton.addEventListener("click", toggleMenu)
overlay.addEventListener("click", closeMenu)

collapseSidebarButton.addEventListener("click", toggleSidebar)



