const openSidebarBtn = document.getElementById("open-sidebar-btn")
const closeSidebarBtn = document.getElementById("close-sidebar-btn")
const sideBar = document.querySelector(".sidebar")

openSidebarBtn.addEventListener("click", () => {
    sideBar.classList.add("open")
})

closeSidebarBtn.addEventListener("click", () => {
    sideBar.classList.remove("open")
})



