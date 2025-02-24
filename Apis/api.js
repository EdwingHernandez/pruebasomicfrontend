//Constante para almacenar la url de conexión a la API
const URL = "http://localhost:8080";

//Constante para almacenar el formato en que se enviará la información
const cabecera = new Headers({
    "Content-Type": "application/json;charset=UTF-8"
});

//Método para traer datos del servidor
async function getData(endPoint){
    try{
        const data = await fetch(`${URL}/${endPoint}`);

        if(data.status === 200){
            let dataJson = await data.json();
            return dataJson
        } else if(data.status === 401){
            console.log("La URL no es correcta");
        } else if(data.status === 404){
            console.log("El producto no existe");
        } else {
            console.log("Se presentó un error en la petición");
        }
    } catch(error){
        console.log(error);
    }

}

//Método para traer datos del servidor buscando busando un ID epecífico
async function getDataId(id, endPoint){
    const data = await fetch(`${URL}/${endPoint}/${id}`);
    let dataJson = await data.json();
    return dataJson
}

//Método para traer datos de cartera
async function getCarteraId(id, endPoint){
    const data = await fetch(`${URL}/${endPoint}/${id}`);
    let dataJson = await data.json();
    return dataJson
}


//Método para enviar datos al servidor
function postData(inputsForm, endPoint){
    fetch(`${URL}/${endPoint}`, {
        method: "POST",
        headers: cabecera,
        body: JSON.stringify(inputsForm)
    })
    .catch(error => console.log(error));
}

//Método para actualizar datos en el servidor
function putData(dataAEnviar, endPoint, id){
    fetch(`${URL}/${endPoint}/${id}`, {
        method: "PUT",
        headers: cabecera,
        body: JSON.stringify(dataAEnviar)
    })
    .catch(error => console.log(error));
}

//Método para eliminar registros
function deleteData(id, endPoint){
    fetch(`${URL}/${endPoint}/${id}`,{
        method: "DELETE",
        headers: cabecera 
    })
    .then(alert("Registro eliminado con éxito"))
    .catch(error => console.log(error));

}




//Exporto todos los métodos
export{getData, postData, getDataId, putData, deleteData, getCarteraId}