
const enviarForm = document.querySelector("#formFactura");

enviarForm.addEventListener("submit", (submit) => {
    submit.preventDefault();
    let formData = new FormData(submit.target);
    agregarArticulo(formData);
    submit.target.reset();
})


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

document.addEventListener("click", function(event) {
    if (event.target.classList.contains("bxs-trash")) {
        event.target.closest("tr").remove(); // Elimina la fila más cercana
    }
});