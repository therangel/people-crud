const burgerBtn = document.getElementById("burger-btn")
const sideBar = document.querySelector(".sidebar")
const overlay = document.querySelector(".overlay")

burgerBtn.addEventListener("click", () => {
    ativarMenu() 
})

overlay.addEventListener("click", () => {
    fecharMenu() 
})

function ativarMenu() {
    sideBar.classList.toggle("active")
    burgerBtn.classList.toggle("active")
    overlay.classList.toggle("active")
}

function fecharMenu() {
    sideBar.classList.remove("active")
    burgerBtn.classList.remove("active")
    overlay.classList.remove("active")
}







