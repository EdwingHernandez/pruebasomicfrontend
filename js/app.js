//Se importan todos los métodos creados en la carpeta Apis
import { getData } from "../Apis/api.js";
import { postData } from "../Apis/api.js";
import { getDataId } from "../Apis/api.js";
import { putData } from "../Apis/api.js";
import { deleteData } from "../Apis/api.js";
import { getCarteraId } from "../Apis/api.js";


//---------------FUNCIONES DE ACCESO A LA API-----------------

//Función para enviar datos al servidor a partir de un fromulario
export function guardarFactura(form, endPoint){
    let datosForm = new FormData(form);
    console.log(datosForm)
    let inputsForm = Object.fromEntries(datosForm);a
    // postData(inputsForm, endPoint);
    console.log(inputsForm);
}

// //Función para agregar opciones a un select con llaves foráneas
// export async function traerLlavesForaneas(padre, endPoint, id = null){
//     const datosForaneos = await getData(endPoint);
//     if(id === null){
//         datosForaneos.forEach(dato => {
//             const opcion = document.createElement("option");
//             opcion.value = dato.id;
//             opcion.textContent = dato.name;
//             padre.appendChild(opcion);         
//         });
//     } else{
//         datosForaneos.forEach(dato => {
//             const opcion = document.createElement("option");
//             if(dato.id === id){
//                 opcion.selected = true;
//             }
//             opcion.value = dato.id;
//             opcion.textContent = dato.name;
//             padre.appendChild(opcion);         
//         });

//     }
// }

//Función para traer y mostrar los datos del servidor
// export async function obtenerDatos(form, padre, endPoint, clase){
//     padre.innerHTML = '';
//     let datosForm = new FormData(form);
//     let inputsForm = Object.fromEntries(datosForm);
//     let textoMin = inputsForm.name.toLowerCase();    
//     const datosObtenidos = await getData(endPoint);

//     datosObtenidos.forEach(datoObt => {
//         if(textoMin === datoObt.name.toLowerCase()){
//             const campoId = document.createElement("h5");
//             const campoName = document.createElement("h5");
//             const boton = document.createElement("button");
            
//             campoId.textContent = datoObt.id;
//             campoName.textContent = datoObt.name;
//             boton.textContent = clase;
//             boton.className = clase;
//             boton.id = datoObt.id;

//             padre.appendChild(campoId);
//             padre.appendChild(campoName);
//             padre.appendChild(boton);
            
//         }
//     });
// }

//Función para autocompletar un campo del form 
export async function autocompletar(dataListPadre, inputext, endPoint){
    let textoMin = inputext.target.value; 
    const datosObtenidos = await getData(endPoint);
    // console.log(datosObtenidos)
    datosObtenidos.forEach(dato => {
        const datoMinuscula = dato.nitDocumento ? dato.nitDocumento : dato.artCod;  
        if(datoMinuscula.toString().includes(textoMin)){
            const sugerencia = document.createElement("option");
            sugerencia.value = dato.nitDocumento ? dato.nitDocumento : dato.artCod;
            sugerencia.id = dato.nitDocumento ? dato.nitDocumento : dato.artCod;
            let values = Array.from(dataListPadre.options).map(opcion => {return opcion.id});
            if(!values.includes(sugerencia.id)){
                dataListPadre.appendChild(sugerencia);
            }   
        }

    });
}

//Función para llenar los demás campos a partir del input del código
export async function autocompletarInputs(divPadre, inputext, endPoint, endPointForeign){
    let textoId = inputext.target.value;

    if(textoId !== ""){
        const datosObtenidosById = await getDataId(textoId, endPoint); 

        if(datosObtenidosById){
            const inputs = divPadre.querySelectorAll('input');
            
            if(endPoint === "nit"){
                inputs[1].value = datosObtenidosById.nitNombre;
                inputs[2].value = datosObtenidosById.nitCupo;
                inputs[3].value = datosObtenidosById.nitPlazo;
                
                let datoForeign = await getCarteraId(textoId, endPointForeign); 
                if(datoForeign){
                    inputs[4].value = datoForeign;
                    inputs[5].value = datosObtenidosById.nitCupo - datoForeign;
                }
            }
            else if(endPoint === "articulo"){
                

                inputs[1].value = datosObtenidosById.artNombre;
                inputs[3].value = datosObtenidosById.artSaldo;
                inputs[5].value = datosObtenidosById.artCosto;
                inputs[6].value = datosObtenidosById.artPrecioV;                
                inputs[7].value = datosObtenidosById.artCosto*inputs[4].value;                
                inputs[8].value = datosObtenidosById.artPrecioV*inputs[4].value;                
                
                
                let datoForeign = await getDataId(datosObtenidosById.laboratorio, endPointForeign);
                // console.log(datoForeign)
                if (datoForeign) {
                    inputs[2].value = datoForeign.labNombre;
                }
                
            }
        }
    }    
}

//Función para prellenar el número de factura
export async function consecutivoEntidad(endPoint) {
    let dataEntidad = await getData(endPoint);  
    // console.log(dataEntidad) 
    if(endPoint === "factura"){
        const inputFactuCod = document.querySelector("#numero_factura");
        inputFactuCod.value =  dataEntidad.at(-1).factuCod + 1;
    }
    else if(endPoint === "kardex"){
        let tablaKardex = document.getElementById("kardex-body");
        let filasKardex = tablaKardex.querySelectorAll("tr");
        
        if(!filasKardex.length == 0){
            let tdsUltimaFila = filasKardex[filasKardex.length- 1].querySelectorAll("td");
            let codigoTra = parseInt(tdsUltimaFila[1].innerText);
            return codigoTra + 1; 
        }
        return dataEntidad.at(-1).kardexCod + 1;
    }
}


//Función para eliminar un registro en el servidor
// export function eliminarRegistro(id, endPoint){

//     if(confirm("¿Seguro que desea eliminar este registro?") === true){
//         deleteData(id, endPoint);
//     }
// }

//Función para actualizar un registro en el servidor
// export function editarRegistro(form, endPoint){
//     let datosForm = new FormData(form);
//     let inputsForm = Object.fromEntries(datosForm);
//     let registroId = form.id.value;
//     putData(inputsForm, endPoint, registroId);
// }

//Función para prellenar el formulario
// export async function prellenarForm(endPoint, id){
//     const registro = await getDataId(id, endPoint);
//     const campoId = document.querySelector("#campoId");
//     const campoName = document.querySelector("#campoName");
    
//     campoId.value = registro.id;
//     campoName.value = registro.name;
// }

//Función 2 para prellenar el formulario
// export async function prellenarFormAct(endPoint, id){
//     const registro = await getDataId(id, endPoint);
//     const campoId = document.querySelector("#campoId");
//     const campoName = document.querySelector("#campoName");
//     const campoCodTransaccion = document.querySelector("#cCodTransaccion");
//     const campoNroFromulario = document.querySelector("#cNroFromulario");
//     const campoValor = document.querySelector("#cValor");
//     const campoSerial = document.querySelector("#cSerial");
//     const campoRespId = document.querySelector("#cResponsableId");
    
//     campoId.value = registro.id;
//     campoName.value = registro.name;
//     campoCodTransaccion.value = registro.codTransaccion;
//     campoNroFromulario.value = registro.nroFromulario;
//     campoValor.value = registro.valor;
//     campoSerial.value = registro.serial;
//     campoRespId.value = registro.responsableId;
// }

//Función para realizar guardar los datos en la base de datos