// Elementos
const nomeInput = document.getElementById("nome")
const idadeInput = document.getElementById("idade")
const cidadeInput = document.getElementById("cidade")
const profissaoInput = document.getElementById("profissao")
const salarioInput = document.getElementById("salario")
const ativoInput = document.getElementById("ativo")
const formulario = document.getElementById("form-pessoa")
const botaoAdd = document.getElementById("botao-adicionar")

const lista = document.getElementById("lista")

const filtroPorCidade = document.getElementById("filtro-cidade")
const filtroPorProfissao = document.getElementById("filtro-profissao")
const filtroPorAtivos = document.getElementById("filtro-ativo")
const filtroOrdenacao = document.getElementById("filtro-ordenacao")
const totalSalarios = document.getElementById("filtro-total-salarios")
const totalPessoas = document.getElementById("filtro-total-pessoas")
const botaoLimparFiltros = document.getElementById("limpar-filtros")


// Dados
const pessoas = []


// Estado
let modo = "adicionar"
let pessoaEmEdicao = null

//Eventos
formulario.addEventListener("submit", (e) => {
    e.preventDefault() //anula o evento padrao de atualizar a pagina ao enviar formulario 
    if(modo === "adicionar"){
        adicionarPessoa()
        
    } else if(modo === "salvar") {
        salvarPessoa(pessoaEmEdicao)
    }      
})

filtroPorCidade.addEventListener("change", aplicarFiltros)
filtroPorProfissao.addEventListener("change", aplicarFiltros)
filtroPorAtivos.addEventListener("change", aplicarFiltros)
filtroOrdenacao.addEventListener("change", aplicarFiltros)

botaoLimparFiltros.addEventListener("click", limparFiltros)

// fazer uma função separada de verificações e armazenalas em um array , depois se algumas delas for false, é porque nao passou na verificação ( ou true)

// VALIDÇÕES

// validarNome()    
// validarIdade()
// validarSalario()
// validarCamposObrigatorios()


// Funções principais
function adicionarPessoa() {
    
    const nomeDuplicado = pessoas.some(pessoa => pessoa.nome === nomeInput.value)

    if(nomeDuplicado) {
        alert("Nome ja existe")
    }else{
        const pessoa = {
            nome: nomeInput.value,
            idade: Number(idadeInput.value),
            cidade: cidadeInput.value,
            profissao: profissaoInput.value,
            salario: Number(salarioInput.value),
            ativo: ativoInput.checked
        }   

        pessoas.push(pessoa)
        limparFormulario()
        aplicarFiltros()
        
    }
}

function limparFormulario(){
    nomeInput.value = ""
    idadeInput.value = ""
    cidadeInput.value = ""
    profissaoInput.value = ""
    salarioInput.value = ""
    ativoInput.checked = false
}

function limparFiltros() {
    filtroPorCidade.value = "todas"
    filtroPorProfissao.value = "todas"
    filtroPorAtivos.checked = false
    filtroOrdenacao.value = "sem-ordenacao"

    aplicarFiltros()
}


function aplicarFiltros() {

    let listaFiltrada = pessoas

    if(filtroPorCidade.value !== "todas") {
        listaFiltrada = listaFiltrada.filter(pessoa => pessoa.cidade === filtroPorCidade.value)
    }

    if(filtroPorProfissao.value !== "todas") {
        listaFiltrada = listaFiltrada.filter(pessoa => pessoa.profissao === filtroPorProfissao.value)
    }

    if(filtroPorAtivos.checked){
        listaFiltrada = listaFiltrada.filter(pessoa => pessoa.ativo)
    }

    let listaOrdenada = [...listaFiltrada]

    if(filtroOrdenacao.value === "nome-a-z") {
        listaOrdenada.sort((a, b) => a.nome.localeCompare(b.nome))    
    }

    if(filtroOrdenacao.value === "nome-z-a") {
        listaOrdenada.sort((a, b) => b.nome.localeCompare(a.nome))
    }  

    if(filtroOrdenacao.value === "salario-menor") {
        listaOrdenada.sort((a, b) => a.salario - b.salario)
    }  

    if(filtroOrdenacao.value === "salario-maior") {
        listaOrdenada.sort((a, b) => b.salario - a.salario)
    } 

    atualizarTela(listaOrdenada)
}

function atualizarTela(lista) {
    renderizarPessoas(lista)
    calcularSalarios(lista)
    atualizarQuantidade(lista)
    contarAtivos(pessoas)
}


function contarAtivos(array) {

    const ativos = array.filter(pessoa => pessoa.ativo)
    console.log(ativos)

    const elementoAtivos = document.getElementById("filtro-total-ativos")
    
    elementoAtivos.textContent = `Ativos: ${ativos.length}`

    console.log(elementoAtivos)
    
}

//Funções auxiliares
function renderizarPessoas(array) {

    lista.innerHTML = ""

    array.forEach((pessoa, index) => {

        const elemento = document.createElement('li')
        elemento.classList.add("user")
        elemento.textContent = `Nome: ${pessoa.nome} | Idade: ${pessoa.idade} | Cidade: ${pessoa.cidade} |
        Profissão: ${pessoa.profissao} | Salário: ${pessoa.salario} | Ativo: ${pessoa.ativo} `
        
        const botaoRemover = document.createElement("button")
        botaoRemover.textContent = "Remover"

        const botaoEditar = document.createElement("button")
        botaoEditar.textContent = "Editar"
        
        botaoRemover.addEventListener("click", () => {    
            const indicePessoa = pessoas.findIndex(pessoaDoArray => pessoaDoArray === pessoa)  
            if(indicePessoa !== -1) {
                pessoas.splice(indicePessoa, 1)
                aplicarFiltros()
            }      
           
            
        })

        botaoEditar.addEventListener("click", () => {                                                                   // ================  PAREI AQUI 
            let pessoaParaEditar = array[index]              
            editarPessoa(pessoaParaEditar) 
        })

        
        elemento.append(botaoRemover, botaoEditar)
        lista.append(elemento)
    })
  
}

function editarPessoa(pessoa){  
                   
    nomeInput.value = pessoa.nome
    idadeInput.value = pessoa.idade
    cidadeInput.value = pessoa.cidade
    profissaoInput.value = pessoa.profissao
    salarioInput.value = pessoa.salario
    ativoInput.checked = pessoa.ativo

    botaoAdd.textContent = "Salvar"

    pessoaEmEdicao = pessoa
    modo = "salvar"
                                                   // ================  PAREI AQUI
}

function salvarPessoa(pessoa) {

    const verificarNome = pessoas.some(pessoa => pessoa.nome === nomeInput.value && pessoa !== pessoaEmEdicao)


    if(verificarNome) {
       window.alert("Nome já existe!")
       return
    }

    pessoa.nome = nomeInput.value
    pessoa.idade = Number(idadeInput.value)
    pessoa.cidade = cidadeInput.value
    pessoa.profissao = profissaoInput.value
    pessoa.salario = Number(salarioInput.value)
    pessoa.ativo = ativoInput.checked

    aplicarFiltros()

    pessoaEmEdicao = null
    modo = "adicionar"
    botaoAdd.textContent = "Adicionar"
    limparFormulario()

}

function calcularSalarios(array) {
    
    const total = array.reduce((acc, pessoa) => {
        return acc += pessoa.salario
    }, 0)

    totalSalarios.textContent = `Salários: R$${total}`
}

function atualizarQuantidade(array) {
    totalPessoas.textContent = `Pessoas: ${array.length}` 
}









