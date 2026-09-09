export async function homePage() {

    const response = await fetch('./src/pages/home/home.html')
 
    return await response.text()
}
