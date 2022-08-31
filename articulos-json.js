export class Articulo {
    constructor(id, codigo, nombre, descripcion, precio, stock, imagen, id_rubro, id_proveedor) {
        this.id = id;
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.id_rubro = id_rubro;
        this.id_proveedor = id_proveedor;
    }
}