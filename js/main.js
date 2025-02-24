//-----------------MÓDULOS IMPORTADOS-------------------------
import { autocompletar,  autocompletarInputs, consecutivoEntidad, guardarFactura} from './app.js';



//----------------------VARIABLES Y CONSTANTES------------------------

//Obtener el formulario
const enviarForm = document.querySelector("#formFactura");
// const inputFactuCod = document.querySelector("#numero_factura");
const inputFecha = document.getElementById("fecha");
const inputFechaVence = document.getElementById("fecha_vencimiento");
const inputNit = document.querySelector("#buscarNit");
const sugerenciasNit = document.querySelector("#sugerenciasCliente");
const inputArtCod = document.querySelector("#buscarArtCod");
const sugerenciasArt = document.querySelector("#sugerenciasArt");
// const divFactura = document.querySelector("#camposFactura");
const divCliente = document.querySelector("#camposCliente");
const divArticulo = document.querySelector("#camposArticulo");
const selectNatu = document.querySelector("#selectNaturaleza");
const inputUnd = document.querySelector("#unidades");
const divPV = document.querySelector("#div-precio_venta");
const divTotalV = document.querySelector("#div-total-venta");
const inputCosto = document.querySelector("#costos");
const totalCosto = document.querySelector("#total-costo");
const inputPrecioV = document.querySelector("#precio_venta");
const totalVenta = document.querySelector("#total-venta");
const inputSaldo = document.querySelector("#saldo");
const pieTabla = document.querySelector("#pie-tabla");
const botonGuardar = document.querySelector("#botonGuardar");
let totalFactura = 0;
window.stockJSON = {};
window.carteraJSON = {};





//--------------------------EVENTOS-------------------------------------

//Evento recargar página
document.addEventListener("DOMContentLoaded", function () {
    let hoy = new Date().toISOString().split("T")[0]; 
    let diaVence = new Date(); 
    diaVence.setDate(diaVence.getDate() + 30);
    inputFecha.value = hoy;
    inputFechaVence.value = diaVence.toISOString().split("T")[0];
    consecutivoEntidad("factura");
    pieTabla.style.display = "none";
    totalFactura = 0;
    stockJSON = {};
    carteraJSON = {};
  });

//Evento submit para agregar un nuevo artículo a la factura
enviarForm.addEventListener("submit", (submit) => {
    submit.preventDefault();
    let formData = new FormData(submit.target);
    agregarArticulo(formData);
    
    let camposFactura = document.querySelectorAll("#camposFactura .campoForm input");
    let camposCliente = document.querySelectorAll("#camposCliente .campoForm input");
    let camposArticulo = document.querySelectorAll("#camposArticulo .campoForm input");


    camposFactura.forEach(campoFactu => campoFactu.readonly = true);
    camposCliente.forEach(campoCliente => campoCliente.readonly = true);
    camposArticulo.forEach(campoArt => campoArt.value = "");
    pieTabla.style.display = "table-row-group";

});


//Evento para eliminar un artículo del kardex
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("bxs-trash")) {
        event.target.closest("tr").remove(); // Elimina la fila más cercana
    }
});

//Evento para autocompletar el campo nitCliente
inputNit.addEventListener('input', (event)=>{
    event.preventDefault();
    autocompletar(sugerenciasNit, event, "nit");
});

//Evento para autorrellenar los campos del cliente a partir del id ingresado
inputNit.addEventListener('change', (event)=>{
    autocompletarInputs(divCliente, event, "nit", "factura/total");
});

//Evento para autocompletar el campo codigo articulo
inputArtCod.addEventListener('input', (event)=>{
    event.preventDefault();
    autocompletar(sugerenciasArt, event, "articulo");
});


//Evento para autorrellenar los campos del articulo a partir del id ingresado
inputArtCod.addEventListener('change', (event)=>{
    event.preventDefault();
    autocompletarInputs(divArticulo, event, "articulo", "laboratorio");
});

//Evento para llenar campos precioVenta - totalVenta dependiendo la naturaleza
selectNatu.addEventListener("change", (event)=>{

    if(selectNatu.value === "+"){
        divPV.style.display = "none";
        divTotalV.style.display = "none";
    }
    else if(selectNatu.value === "-"){
        divPV.style.display = "flex";
        divTotalV.style.display = "flex";
    }
});


//Evento para llenar campos totalCosto - totalVenta dependiendo de las unidades
inputUnd.addEventListener("input", ()=>{
    totalCosto.value = inputCosto.value*inputUnd.value;
    totalVenta.value = inputPrecioV.value*inputUnd.value;
    if(selectNatu.value === "-"){
        let saldoDisponible = parseFloat(inputSaldo.value) || 0;
        let unidadesIngresadas = parseFloat(inputUnd.value) || 0;

        if (unidadesIngresadas > saldoDisponible) {
            alert("No puedes ingresar más unidades de las disponibles en saldo");
            inputUnd.value = saldoDisponible;
        }
    }
});

//Evento para guardar la factura al dar click al botón
botonGuardar.addEventListener("click", ()=>{

    

    guardarFactura(event);
})

//---------------FUNCIONES PARA DAR ESTILO AL HTML Y CSS------------------------

//Función para agregar un nuevo artículo al kardex
async function agregarArticulo(formData) {

    let kardexCod = await consecutivoEntidad("kardex");
    let kardexNatu = formData.get("naturaleza");
    let artCod = formData.get("codigo_articulo");
    let artNombre = formData.get("nombre_articulo");
    let artUnd = formData.get("unidades");
    let nitCliente = formData.get("nit_cliente");
    let carteraCliente = formData.get("cartera");

    let artVrUnit = "";
    let subtotal = "";
    if(kardexNatu === "+"){
        artVrUnit = formData.get("costos");
        subtotal = formData.get("total-costo");
        totalFactura+=parseInt(subtotal);
        if(stockJSON[artCod]){
            stockJSON[artCod].stock += parseInt(artUnd);
        }else{
            stockJSON.id = artCod;
            stockJSON[artCod] = { stock: parseInt(formData.get("saldo")) + parseInt(artUnd) };
        }

        if(carteraJSON[nitCliente]){
            carteraJSON[nitCliente].cartera -= parseInt(carteraCliente);
        }else{
            carteraJSON.id = nitCliente;
            carteraJSON[nitCliente] = { cartera: parseInt(formData.get("saldo")) - parseInt(nitCliente) };
        }        
        
    }
    else{
        artVrUnit = formData.get("precio_venta");
        subtotal = formData.get("total-venta");
        totalFactura-=parseInt(subtotal);
        if(stockJSON[artCod]){
            console.log("entraaa")
            stockJSON[artCod].stock -= parseInt(artUnd);
        }else{
            stockJSON.id = artCod;
            stockJSON[artCod] = { stock: parseInt(formData.get("saldo")) - parseInt(artUnd)};
            console.log(stockJSON)
        }
    }
    
    let factuCod = formData.get("numero_factura");

    let tablaKardex = document.getElementById("kardex-body");

    const campoTotalFactu = document.querySelector("#campoTotal");
    campoTotalFactu.innerText = totalFactura;


    const filaArticulo = document.createElement("tr");
    filaArticulo.innerHTML = `
        <td><i class='bx bxs-trash'></i></td>
        <td>${kardexCod}</td>
        <td>${kardexNatu}</td>
        <td>${factuCod}</td>
        <td>${artCod}</td>
        <td>${artNombre}</td>
        <td>${artUnd}</td>
        <td>${artVrUnit}</td>
        <td>${subtotal}</td>    

    `





    tablaKardex.appendChild(filaArticulo);
    
}



