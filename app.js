const API = "https://script.google.com/macros/s/AKfycbw0nVXN4pVR5FAiNjZQznoEoJ3skTKX2VUYGA-FWH5IQ-QbRlKbZ-KEdDoD8gbO_bd7/exec"

let pedidos = []

function mostrarTela(tela){

document.querySelectorAll(".tela")
.forEach(t => t.style.display="none")

document.getElementById(tela).style.display="block"

}

mostrarTela("vendas")

function criarPedido(){

let cliente = document.getElementById("cliente").value
let produto = document.getElementById("produto").value
let quantidade = document.getElementById("quantidade").value

let pedido = {

id: Date.now(),

cliente,

produto,

quantidade,

status:"producao"

}

pedidos.push(pedido)

fetch(API,{
method:"POST",
body:JSON.stringify({
cliente:cliente,
produto:produto,
quantidade:quantidade
})
})

.then(res=>res.text())
.then(data=>{
console.log("Salvo no Google Sheets")
})

render()

document.getElementById("cliente").value=""
document.getElementById("produto").value=""
document.getElementById("quantidade").value=""

}

function carregarPedidos(){

fetch(API)
.then(res=>res.json())
.then(data=>{

pedidos = data.map(p=>({

id:p[0],
cliente:p[1],
produto:p[2],
quantidade:p[3],
status:p[4]

}))

render()

})

}

function render(){

let prod = document.getElementById("listaProducao")
let mont = document.getElementById("listaMontagem")

let pProd = document.getElementById("painelProducao")
let pMont = document.getElementById("painelMontagem")
let pFin = document.getElementById("painelFinal")

prod.innerHTML=""
mont.innerHTML=""

pProd.innerHTML=""
pMont.innerHTML=""
pFin.innerHTML=""

pedidos.forEach(p=>{

if(p.status=="producao"){

prod.innerHTML+=cardProducao(p)

pProd.innerHTML+=painelCard(p)

}

if(p.status=="montagem"){

mont.innerHTML+=cardMontagem(p)

pMont.innerHTML+=painelCard(p)

}

if(p.status=="final"){

pFin.innerHTML+=painelCard(p)

}

})

}

function cardProducao(p){

return `

<div class="card">

<h4>OS ${p.id}</h4>

Cliente: ${p.cliente}<br>

Produto: ${p.produto}

<button onclick="enviarMontagem(${p.id})">

Enviar para montagem

</button>

</div>

`

}

function cardMontagem(p){

return `

<div class="card">

<h4>OS ${p.id}</h4>

Cliente: ${p.cliente}<br>

Produto: ${p.produto}

<button onclick="finalizar(${p.id})">

Finalizar Pedido

</button>

</div>

`

}

function painelCard(p){

return `

<div>

<strong>${p.cliente}</strong><br>

${p.produto}

</div>

`

}

function enviarMontagem(id){

let p = pedidos.find(x=>x.id==id)

p.status="montagem"

render()

}

function finalizar(id){

let p = pedidos.find(x=>x.id==id)

p.status="final"

render()

}

carregarPedidos()

