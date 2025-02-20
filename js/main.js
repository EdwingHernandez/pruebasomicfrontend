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
    autocompletarInputs(divArticulo, event, "articulo", "laboratorio");
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
    if(kardexNatu === "+"){
        artVrUnit = formData.get("costos");
    }
    else{
        artVrUnit = formData.get("precio_venta");
    }
    let subtotal = formData.get("total");
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

