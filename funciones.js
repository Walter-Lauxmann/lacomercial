// URL para acceder a la API
const url = './api/datos.php?tabla=productos';

// Elementos del DOM
const navLogin = document.getElementById("navlogin");
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
const inputImagen = document.getElementById("imagen");

// Imagen
const frmImagen = document.getElementById("frmimagen");

// Variables
let opcion = '';
let id;

// Control de usuario
let usuario = '';
let logueado = false;
if (sessionStorage.getItem('usuario')) { // Si existe el item Usuario en sessionStorage
    usuario = sessionStorage.getItem('usuario'); // Lo asignamos a la variable usuario
    logueado = true; // Establecemos la variable logueado en verdadero
}
console.log(usuario); // Mostramos el usuario por consola

if (logueado) { // Si está logueado
    navLogin.setAttribute('href', '#'); // Establecemos el link de navLogin en #
    navLogin.innerHTML = 'Salir'; // Establecemos el texto de navLogin
    btnCrear.style.display = 'inline'; // Mostramos el botón crear
    navLogin.addEventListener('click', () => { // Agregamos el evento clic al navLogin
        sessionStorage.setItem('usuario', ''); // Borramos el contenido del item usuario
        logueado = false; // Establecemos la variable logueado en falso
        window.location.reload(); // Actualizamos la página
    })
} else { // Sino
    navLogin.setAttribute('href', './login.html'); // Establecemos el link de navLogin en login.html
    navLogin.innerHTML = 'Iniciar sesión'; // Establecemos el texto de navLogin
    btnCrear.style.display = 'none'; // Ocultamos el botón crear
}

/* Función asíncrona para cargar artículos */
async function cargarArticulos() {
    divProductos.innerHTML = `Cargando datos... <img src="./imagenes/Spin-1s-200px.gif" style="width:20px;">`;
    // Leer el JSON
    let response = await fetch(url + '&accion=seleccionar'); // Ejecutamos el método seleccionar de la API
    let datos = await response.json();
    if (response.status !== 200) {
        throw Error('Los datos no existen');
    }
    divProductos.innerHTML = ``;
    return datos;
}

/* Función asíncrona para mostrar artículos */
async function mostrarArticulos() {
    try { // Tratar
        const articulos = await cargarArticulos();
        divProductos.innerHTML = ``;
        if (logueado) { // Si está logueado
            for (let articulo of articulos) { // Para cada articulo en articulos
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
        } else { // Sino
            for (let articulo of articulos) { // Para cada articulo en articulos
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
                        </div>
                    </div>
                    `;
            }
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

/* Función on para determinar en qué elemento se realiza un evento */
const on = (elemento, evento, selector, manejador) => {
    elemento.addEventListener(evento, e => {
        if (e.target.closest(selector)) {
            manejador(e);
        }
    })
}

/* Ejecutamos la función on para el botón Borrar */
on(document, 'click', '.btnBorrar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón
    id = cardFooter.querySelector('.idArticulo').value; // Obtenemos el id del artículo
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML; // Obtenemos el nombre del artículo
    let aceptar = confirm(`¿Realmente desea eliminar a ${nombre}`); // Pedimos confirmación para eliminar
    if (aceptar) {
        console.log(nombre + " borrado");
        fetch(url + '&accion=eliminar&id=' + id, {}) // Ejecutamos el método eliminar de la API
            .then(res => res.json())
            .then(data => {
                alerta.innerHTML = `${data}`;
                mostrarArticulos();
            })
    }
})
/* Ejecutamos la función on para el botón Editar */
on(document, 'click', '.btnEditar', e => {
    const cardFooter = e.target.parentNode; // Guardamos el elemento padre del botón
    // Obtenemos los datos del artículo seleccionado
    id = cardFooter.querySelector('.idArticulo').value;
    const codigo = cardFooter.parentNode.querySelector('span[name=spancodigo]').innerHTML;
    const nombre = cardFooter.parentNode.querySelector('span[name=spannombre]').innerHTML;
    const descripcion = cardFooter.parentNode.querySelector('.card-text').innerHTML;
    const precio = cardFooter.parentNode.querySelector('span[name=spanprecio]').innerHTML;
    const imagen = cardFooter.querySelector('.imagenArticulo').value;
    // Asignamos los valores a los input del formulario
    inputCodigo.value = codigo;
    inputNombre.value = nombre;
    inputDescripcion.value = descripcion;
    inputPrecio.value = precio;
    frmImagen.src = './imagenes/productos/' + imagen;
    formularioModal.show(); // Mostramos el formulario
    opcion = 'actualizar';

})

/* Agregamos el evento clic al botón Crear */
btnCrear.addEventListener('click', () => {
    // Limpiamos los input del formulario
    inputCodigo.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputPrecio.value = '';
    inputImagen.value = '';
    frmImagen.src = './imagenes/productos/nodisponible.png';
    formularioModal.show(); // Mostramos el formulario
    opcion = 'insertar';
})

/* Agregamos el evento submit al formulario */
formulario.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevenimos la acción por defecto del formulario
    const datos = new FormData(formulario); // Obtenemos los datos del formulario
    if (opcion == 'insertar') { // Si la opción es insertar
        fetch(url + '&accion=insertar', { // Ejecutamos el método insertar de la API
                method: 'POST',
                body: datos
            })
            .then(res => res.json())
            .then(data => {
                alerta.innerHTML = `${data}`;
                mostrarArticulos();
            })
    }
    if (opcion == 'actualizar') { // Si la opción es actualizar
        fetch(url + '&accion=actualizar&id=' + id, { // Ejecutamos el método actualizar de la API
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