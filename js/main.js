//-----------------MÓDULOS IMPORTADOS-------------------------
import { autocompletar,  autocompletarInputs} from './app.js';



//----------------------VARIABLES Y CONSTANTES------------------------

//Obtener el formulario
const enviarForm = document.querySelector("#formFactura");
const inputNit = document.querySelector("#buscarNit");
const sugerenciasNit = document.querySelector("#sugerenciasCliente");
const inputArtCod = document.querySelector("#buscarArtCod");
const sugerenciasArt = document.querySelector("#sugerenciasArt");
const divFactura = document.querySelector("#camposFactura");
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





//--------------------------EVENTOS-------------------------------------

//Evento recargar página
document.addEventListener("DOMContentLoaded", function () {
    let inputFecha = document.getElementById("fecha");
    let hoy = new Date().toISOString().split("T")[0]; // Obtiene la fecha en formato YYYY-MM-DD
    inputFecha.value = hoy;
  });

//Evento submit para agregar un nuevo artículo a la factura
enviarForm.addEventListener("submit", (submit) => {
    submit.preventDefault();
    let formData = new FormData(submit.target);
    agregarArticulo(formData);
    
    let camposFactura = document.querySelectorAll("#camposFactura .campoForm input");
    let camposCliente = document.querySelectorAll("#camposCliente .campoForm input");
    let camposArticulo = document.querySelectorAll("#camposArticulo .campoForm input");


    camposFactura.forEach(campoFactu => campoFactu.disabled = true);
    camposCliente.forEach(campoCliente => campoCliente.disabled = true);
    camposArticulo.forEach(campoArt => campoArt.value = "");

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


//---------------FUNCIONES PARA DAR ESTILO AL HTML Y CSS------------------------

//Función para agregar un nuevo artículo al kardex
function agregarArticulo(formData) {

    let kardexCod = 1;
    let kardexNatu = formData.get("naturaleza");
    let artCod = formData.get("codigo_articulo");
    let artNombre = formData.get("nombre_articulo");
    let artUnd = formData.get("unidades");
    let artVrUnit = "";
    let subtotal = "";
    if(kardexNatu === "+"){
        artVrUnit = formData.get("costos");
        subtotal = formData.get("total-costo");
    }
    else{
        artVrUnit = formData.get("precio_venta");
        subtotal = formData.get("total-venta");
    }
    
    let factuCod = formData.get("numero_factura");

    let tablaKardex = document.getElementById("kardex-body");

    
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

//---------------FUNCIONES DE ACCESO A LA API-----------------

