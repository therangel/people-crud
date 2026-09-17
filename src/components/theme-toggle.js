
const theme = localStorage.getItem("theme") || "light" ;

let chosenTheme = theme

export function initTheme() {
    
    if(theme === "dark") {
        document.documentElement.classList.add("dark") 
    }

    if(theme === "light"){
        document.documentElement.classList.remove("dark") 
    }
}

export function switchTheme() {

    console.log(chosenTheme)

    if(chosenTheme === "light"){

       document.documentElement.classList.add("dark")  
       localStorage.setItem("theme", "dark")
       chosenTheme = "dark"

    } else {
        document.documentElement.classList.remove("dark")  
        localStorage.setItem("theme", "light")
        chosenTheme = "light"
    } 
}
