const txtName = document.getElementById("Name"); // Nombre
const txtNumber = document.getElementById("Number"); // Cantidad
const btnAgregar = document.getElementById("btnAgregar");
const alertValidacionesTexto = document.getElementById("alertValidacionesTexto");
const alertValidaciones = document.getElementById("alertValidaciones");
const tablaListaCompras = document.getElementById("tablaListaCompras");
const cuerpoTabla = tablaListaCompras.getElementsByTagName("tbody").item(0);

const contadorProductos = document.getElementById("contadorProductos");
const productosTotal = document.getElementById("productosTotal");
const precioTotal = document.getElementById("precioTotal");

// Contador para la primera columna de la tabla
let cont = 0;
// Contador para la columna de resumen
let costoTotal = 0;
let totalEnProductos = 0;
// Arreglo para almacenar los elementos de la tabla
let datos = new Array(); 

function validarCantidad(){
    // length < 0 - Valida que no este vacio 
    if (txtNumber.value.trim().length <= 0) { 
        return false;
    } 

    // Valida que es un valor numerico 
    // isNAN = true - No es un número
    // isNAN = false - Es un número 
    // Se valida antes del if <= 0 porque no tendria caso hacer una valiación con un dato no numerico
    if (isNaN(txtNumber.value)) {
        return false;
    }
    
    // Valida no tener cantidades negativas (<=0), por logica del ejercicio 
    if (Number(txtNumber.value) <= 0) {
        return false;
    }

    return true;
}

// Crear precios al azar
// Math.random() - Genera números entre 0 y 1
// Math.round() - Redondea al entero más proximo sea hacia arriba o abajo

function getPrecio() {
    return Math.round(Math.random()*10000) / 100;
}


btnAgregar.addEventListener("click", function(event){
    event.preventDefault();

    // Bandera, al ser true permite agregar los datos a la tabla
    let isValid = true;

    alertValidacionesTexto.innerHTML = ""; // Evita que aparezca el mensaje de alerta si el producto es valido
    alertValidaciones.style.display = "none"; // Evita que aparezca el bloque de alerta si el producto es valido
    txtName.style.border = ""; // Evita los estilos en el bloque si el producto es valido
    txtNumber.style.border = "";

    txtName.value = txtName.value.trim(); // Quita los espacios en blanco antes del texto
    txtNumber.value = txtNumber.value.trim(); // Quita los espacios en blanco antes del texto

    if (txtName.value.length < 3) { // Si es menor a 3, mostrara una alerta de producto invalido
        txtName.style.border = "solid medium red"; // Estilo del bloque de alerta
        alertValidacionesTexto.innerHTML = "<strong>El Nombre del producto no es correcto.</strong>"; // Mensaje de alerta
        alertValidaciones.style.display = "block"; // El bloque de alerta se muestra en bloque
        isValid = false;
    }

    if (! validarCantidad()) { 
        txtNumber.style.border = "solid medium red"; 
        alertValidacionesTexto.innerHTML += "<br/><strong>La cantidad no es correcta.</strong>"; 
        alertValidaciones.style.display = "block";
        isValid = false;
    }

    // Si paso las validaciones
    if (isValid) {
        cont++;
        let precio = getPrecio(); // Ultima columna
        let row = ` <tr>
                        <td>${cont}</td>
                        <td>${txtName.value}</td>
                        <td>${txtNumber.value}</td>
                        <td>${precio}</td>
                    </tr>`;
        cuerpoTabla.insertAdjacentHTML("beforeend", row);

        // Creación del objeto con los elementos de la tabla
        let elemento = {
                        "cont" : cont,
                        "nombre" : txtName.value,
                        "cantidad" : txtNumber.value,
                        "precio" : precio
                    };
        // Se guardan los objetos en el arreglo
        datos.push(elemento);

        // Se guarda la información de forma local para accdecer a ella 
        localStorage.setItem("datos", JSON.stringify(datos));

        // Resumen
        // Total de cantidad de productos 
        costoTotal += precio * Number(txtNumber.value);
        precioTotal.innerText = "$" + costoTotal.toFixed(2);
        // Precio total
        totalEnProductos += Number(txtNumber.value);
        productosTotal.innerText = totalEnProductos;
        // Conteo total de diferentes productos
        contadorProductos.innerText = cont; // Se reutiliza el contador de columna

        // Se crea objeto de resumen para no perder la información al salir
        // Se hace despues del bloque anterior para que se actualice 
        let resumen = {
                        "cont" : cont,
                        "totalEnProductos" : totalEnProductos,
                        "costoTotal" : costoTotal
                    };

        // No se crea un arreglo como en datos
        localStorage.setItem("resumen", JSON.stringify(resumen));

        // "Limpia" la pantalla al agregar el producto 
        // Regresa automaticamente al campo de nombre
        txtName.value = "";
        txtNumber.value = "";
        txtName.focus();
    } // if isValid

}); // btnAgregar

// Cuando regresemos/cargue la pagina regresen los datos del localStorage 
window.addEventListener("load", function(event){
    event.preventDefault();

    // Validar que no haya datos guardados
    if (this.localStorage.getItem("datos") != null) {
        datos = JSON.parse(this.localStorage.getItem("datos"));
    }

    // Acomodar los datos en la tabla
    datos.forEach((d) => {
        let row = `<tr>
                    <td>${d.cont}</td>
                    <td>${d.nombre}</td>
                    <td>${d.cantidad}</td>
                    <td>${d.precio}</td>
                   </tr>`;
        cuerpoTabla.insertAdjacentHTML("beforeend", row);
    });

    if (this.localStorage.getItem("resumen") != null) {
        let resumen = JSON.parse(this.localStorage.getItem("resumen"));
        // Guardar los datos obtenidos
        costoTotal = resumen.costoTotal;
        totalEnProductos = resumen.totalEnProductos;
        cont = resumen.cont;
    }

    // Mostrar dichos datos obtenidos
    precioTotal.innerText = "$" + costoTotal.toFixed(2);
    productosTotal.innerText = totalEnProductos;
    contadorProductos.innerText = cont;
    
})

// Agregar la funcionalidad del boton Limpiar Todo
// Resumen
// Tabla
// Campos
// Alerta

// Borrar Todo
const btnClear = document.getElementById("btnClear");

btnClear.addEventListener("click", function(event) {
    event.preventDefault();
    let isValid = true;
    alertValidacionesTexto.innerHTML = ""; 
    alertValidaciones.style.display = "none"; 
    txtName.style.border = "";
    txtNumber.style.border = "";
    txtName.value = "";
    txtNumber.value = "";
    cuerpoTabla.innerHTML = "";
    precioTotal.innerText = "";
    productosTotal.innerText = "";
    contadorProductos.innerText = "";
    cont = 0;
    localStorage.removeItem("datos");
    localStorage.removeItem("resumen");
});