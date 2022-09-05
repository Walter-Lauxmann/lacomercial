//import {Articulo} from "./articulos-json.js";
const divProductos = document.getElementById("productos");
const btnFormulario = document.getElementById("btnFormulario");
const formulario = document.getElementById("formulario");
const alerta = document.getElementById("alerta");

//let articulo = new Articulo();

async function cargarArticulos() {
    divProductos.innerHTML = `Cargando datos...`;
    // Leer el JSON
    let response = await fetch('./api/datos.php?tabla=productos&accion=seleccionar');
    let datos = await response.json();
    if (response.status !== 200) {
        throw Error('Los datos no existen');
    }
    divProductos.innerHTML = ``;
    return datos;
}

async function mostrarArticulos () {
    try {
        const articulos = await cargarArticulos();
        console.log(articulos);
        divProductos.innerHTML = ``;
        for (let articulo of articulos) {
            divProductos.innerHTML += `
                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <img src="imagenes/productos/${articulo.imagen?articulo.imagen:'AAF.jpg'}" class="card-img-top" alt="${articulo.nombre}">
                        <div class="card-body">
                            <h5 class="card-title"><span name="spancodigo">${articulo.codigo}</span> - <span name="spannombre">${articulo.nombre}</span></h5>
                            <p class="card-text">${articulo.descripcion}.</p>
                            <h5>$ <span name="spanprecio">${articulo.precio}</span></h5>
                            <input class="form-control" type="number" value="0" min="0" max="${articulo.stock}" name="cantidad">
                        </div>
                    </div>
                </div>
                `;
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

mostrarArticulos();

btnFormulario.addEventListener('click', function(e) {

})

formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    const datos = new FormData(formulario);
    console.log(datos.get('txtcodigo'));

    fetch('./api/datos.php?tabla=productos&accion=insertar', {
        method: 'POST',
        body: datos
    })
    .then( res => res.json())
    .then( data => {
        alerta.innerHTML = `${data}`;mostrarArticulos();
    })
})