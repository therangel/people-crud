const burgerBtn = document.getElementById("burger-btn")
const sideBar = document.querySelector(".sidebar")
const overlay = document.querySelector(".overlay")

burgerBtn.addEventListener("click", () => {
    ativarMenu() 
})

overlay.addEventListener("click", () => {
    ativarMenu() 
})

function ativarMenu() {
    sideBar.classList.toggle("active")
    burgerBtn.classList.toggle("active")
    overlay.classList.toggle("active")
}






