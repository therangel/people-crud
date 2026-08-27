const menuButton = document.getElementById("burger-btn")
const sidebar = document.querySelector(".sidebar")
const overlay = document.querySelector(".overlay")

menuButton.addEventListener("click", toggleMenu)

overlay.addEventListener("click", closeMenu)

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







