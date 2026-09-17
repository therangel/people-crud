
let statesCache = null; 

export async function getStates() {

    if (statesCache) return statesCache;

    const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")

    const data = await response.json()

    // console.log(data)

    return data
}



