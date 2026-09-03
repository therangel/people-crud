const menuButton = document.getElementById("burger-btn")
const sidebar = document.querySelector(".sidebar")
const overlay = document.querySelector(".overlay")
const collapseSidebarButton = document.querySelector(".collapse-sidebar")
const closeSidebarButton = document.querySelector(".close-sidebar")
const homePageLink = document.querySelector(".home")
const clientPageLink = document.querySelector(".client")


function openSidebar() {
    sidebar.classList.add("active")
    overlay.classList.add("active")
}

function closeMenu() {
    sidebar.classList.remove("active")
    overlay.classList.remove("active")
}

function collapseSidebar() {
    sidebar.classList.toggle("collapsed")
    collapseSidebarButton.classList.toggle("collapsed")
}


menuButton.addEventListener("click", openSidebar)
overlay.addEventListener("click", closeMenu)
closeSidebarButton.addEventListener("click", closeMenu)

collapseSidebarButton.addEventListener("click", collapseSidebar)



