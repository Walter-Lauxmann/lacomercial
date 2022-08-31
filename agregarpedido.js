agregarPedido = function () {
    const detalle = document.getElementById("detalle");
    const codigos = document.getElementsByName("spancodigo");
    const nombres = document.getElementsByName("spannombre");
    const cantidades = document.getElementsByName("cantidad");
    const precios = document.getElementsByName("spanprecio");
    let codigo;
    let nombre;
    let cantidad;
    let precio;
    let total;
    let totalPedido = 0;
    detalle.innerHTML = "";
    for (let i = 0; i < cantidades.length; i++) {
        if (cantidades[i].value > 0) {
            codigo = codigos[i].innerHTML;
            nombre = nombres[i].innerHTML;
            cantidad = cantidades[i].value;
            precio = parseFloat(precios[i].innerHTML);

            total = cantidad * precio;
            totalPedido += total;
            detalle.innerHTML += `
                <tr>
                    <td>${codigo}</td>
                    <td>${nombre}</td>
                    <td>${cantidad}</td>
                    <td>$ ${precio}</td>
                    <td>$ ${total}</td>
                </tr>
                `;
        }
    }
    document.getElementById("total").innerHTML = totalPedido;
}
