//import {producto} from "./modelos/articulo.js";
const url = './api/datos.php?tabla=productos';
const divProductos = document.getElementById("productos");
const btnCrear = document.getElementById("btnCrear");
const formulario = document.getElementById("formulario");
const alerta = document.getElementById("alerta");
const formularioModal = new bootstrap.Modal(document.getElementById("formularioModal"));

// Inputs
const inputCodigo = document.getElementById("codigo");
const inputNombre = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");

// Imagen
const frmImagen = document.getElementById("frmimagen");

let articulos = [];
let opcion = '';
let id;

async function cargarArticulos() {
    divProductos.innerHTML = `Cargando datos... <img src="./imagenes/Spin-1s-200px.gif" style="width:20px;">`;
    // Leer el JSON
    let response = await fetch(url + '&accion=seleccionar');
    let datos = await response.json();
    if (response.status !== 200) {
        throw Error('Los datos no existen');
    }
    divProductos.innerHTML = ``;
    return datos;
}

async function mostrarArticulos() {
    try {
        articulos = await cargarArticulos();
        divProductos.innerHTML = ``;
        for (let articulo of articulos) {
            divProductos.innerHTML += `
                <div class="col">
                    <div class="card" style="width: 18rem;">
                        <img src="imagenes/productos/${articulo.imagen?articulo.imagen:'nodisponible.png'}" class="card-img-top" alt="${articulo.nombre}">
                        <div class="card-body">
                            <h5 class="card-title"><span name="spancodigo">${articulo.codigo}</span> - <span name="spannombre">${articulo.nombre}</span></h5>
                            <p class="card-text">${articulo.descripcion}.</p>
                            <h5>$ <span name="spanprecio">${articulo.precio}</span></h5>
                            <input class="form-control" type="number" value="0" min="0" max="${articulo.stock}" name="cantidad">
                        </div>
                        <div class="card-footer">
                            <a class="btnEditar btn btn-primary">Editar</a>
                            <a class="btnBorrar btn btn-danger">Borrar</a>
                            <input type="hidden" class="idArticulo" value="${articulo.id}">
                            <input type="hidden" class="imagenArticulo" value="${articulo.imagen}">
                        </div>
                    </div>
                </div>
                `;
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => {
        if(e.target.closest(selector)) {
            manejador(e);
        }
    })
}

on(document, 'click', '.btnBorrar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.idArticulo').value;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    let aceptar = confirm(`¿Realmente desea eliminar a ${nombre}`);
    if(aceptar) {
        console.log(nombre + " borrado");
        fetch(url+'&accion=eliminar&id=' + id, {})
        .then(res => res.json())
        .then(data => {
            alerta.innerHTML = `${data}`;
            mostrarArticulos();
        })
    }
})

on(document, 'click', '.btnEditar', e => {
    const cardFooter = e.target.parentNode;
    id = cardFooter.querySelector('.idArticulo').value;
    const codigo = cardFooter.parentNode.querySelector('span[name=spancodigo]').innerHTML;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    const descripcion = cardFooter.parentNode.querySelector('.card-text').innerHTML;
    const precio = cardFooter.parentNode.querySelector('span[name=spanprecio]').innerHTML;
    const imagen = cardFooter.querySelector('.imagenArticulo').value;
    
    inputCodigo.value = codigo;
    inputNombre.value = nombre;
    inputDescripcion.value = descripcion;
    inputPrecio.value = precio;
    frmImagen.src = './imagenes/productos/' + imagen;
    
    formularioModal.show();
    opcion = 'actualizar';

})


btnCrear.addEventListener('click', () => {
    inputCodigo.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputPrecio.value = '';
    formularioModal.show();
    opcion = 'insertar';
})

formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    const datos = new FormData(formulario);
    if(opcion == 'insertar') {
        fetch(url+'&accion=insertar', {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(data => {
            alerta.innerHTML = `${data}`;
            mostrarArticulos();
        })
    }
    if(opcion == 'actualizar') {
        fetch(url+'&accion=actualizar&id='+id, {
            method: 'POST',
            body: datos
        })
        .then(res => res.json())
        .then(data => {
            alerta.innerHTML = `${data}`;
            mostrarArticulos();
        })
    }
    
})

mostrarArticulos();