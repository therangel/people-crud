export async function getCep(cep) {

    if(cep.length !== 8) {
        console.error("Formato de CEP inválido. Deve conter 8 dígitos.");
        return null;
    }

    try {

        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

        if (!response.ok) {
            throw new Error(`Erro no servidor HTTP: ${response.status}`)
        }

        const data = await response.json()

        if(data.erro) {
            console.warn("CEP não encontrado na base de dados.")
            return null;
        }

        const filteredData = { 
            state: data.estado,
            city: data.localidade,
            district: data.bairro,
            street: data.logradouro
        }

        return filteredData 
    } 

    catch (erro) {
        console.error("Falha na requisiçã:", erro.message)
        return null
    
    }
       
}
