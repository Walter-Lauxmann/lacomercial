<?php
require_once('config.php'); // Requerimos el archivo config.php

/* Definimos la clase principal */
class Modelo {
    // definimos la propiedad _db
    protected $_db;
    // Creamos el constructor con la conexión a la BD
    public function __construct() {
        $this->_db = new mysqli(DB_HOST,DB_USER,DB_PASS,DB_NAME);
        // Si se produce un error de conexión, muestra un error
        if ( $this->_db->connect_errno ) {
            echo "Fallo al conectar a MySQL: ".$this->_db->connect_error;
            return;
        }
        // Establecemos el conjunto de caracteres a utf8
        $this->_db->set_charset(DB_CHARSET);
        $this->_db->query("SET NAMES 'utf8'");
    }
}
/* Fin de la clase principal */

/* Clase ModeloABM basada e la clase Modelo */
class ModeloABM extends Modelo {
    // Propiedades
    private $tabla;         // Nombre de la tabla
    private $id= 0;         // Id del registro
    private $criterio= '';  // Criterio para las consultas
    private $campos= '*';   // Lista de campos
    private $orden= 'id';   // Campo de ordenamiento
    private $limit= 0;      // Cantidad de registros

    // Método constructor
    public function __construct($t) {
        parent::__construct();  // Ejecutamos el constructor de la clase padre
        $this->tabla = $t;      // Asignamos a $tabla el parámetro $t
    }

    /* GETTER */
    public function get_tabla() {
        return $this->tabla;
    }
    public function get_id() {
        return $this->id;
    }
    public function get_criterio() {
        return $this->criterio;
    }
    public function get_campos() {
        return $this->campos;
    }
    public function get_orden() {
        return $this->orden;
    }
    public function get_limit() {
        return $this->limit;
    }

    /* SETTER */
    public function set_tabla($tabla) {
        $this->tabla= $tabla;
    }
    public function set_id($id) {
        $this->id= $id;
    }
    public function set_criterio($criterio) {
        $this->criterio= $criterio;
    }
    public function set_campos($campos) {
        $this->campos= $campos;
    }
    public function set_orden($orden) {
        $this->orden= $orden;
    }
    public function set_limit($limit) {
        $this->limit= $limit;
    }

    /* Método de selección */
    public function seleccionar() {
        // Guardamos en la variable $sql la instrucción SELECT
        $sql= "SELECT $this->campos FROM $this->tabla"; // SELECCIONAR $campos DESDE $tabla
        // Si el criterio NO es igual a NADA
        if ( $this->criterio != '' ) {
            // Agregamos el criterio
            $sql .= " WHERE $this->criterio"; // DONDE $criterio
        }
        // Agregamos el orden
        $sql .= " ORDER BY $this->orden"; // ORDENADO POR $orden
        // Si $limit es mayor que cero
        if ( $this->limit > 0 ) {
            // Agregamos el límite
            $sql .= " LIMIT $this->limit"; // LIMITE $limit
        }
        //echo $sql.'<br>'; // Mostramos la instrucción SQL resultante
        $resultado= $this->_db->query($sql); // Ejecutamos la consulta y la guardamos en $resultado
        $datos= $resultado->fetch_all(MYSQLI_ASSOC); // Guardamos los datos resultantes en un Array asociativo
        $json_datos= json_encode($datos); // Convertimos los datos en formato JSON
        return $json_datos; // Retornamos los datos en formato JSON 
    }

    /* Método para la inserción de datos */
    public function insertar($valores) {
        $campos= '';
        $datos= '';
        unset($valores->id); // Quitamos el id del conjunto de $valores
        // Para cada $valores como $key => $value
        foreach ( $valores as $key => $value ) {
            $value = "'".$value."'"; // Agregamos apóstrofe (') antes y después de cada $value
            $campos .= $key.","; // Agregamos a la variable $campos el $key y una coma (,)
            $datos .= $value.","; // Agregamos a la variable $datos el $value y una coma (,)
        }
        $campos= substr($campos,0,strlen($campos)-1); // Quitamos el último caracter (,) a $campos
        $datos= substr($datos,0,strlen($datos)-1); // Quitamos el último caracter (,) a $datos
        // Guardamos en la variable $sql la instrucción INSERT
        $sql= "INSERT INTO $this->tabla($campos) VALUES($datos)"; // INSERTAR DENTRO de $tabla en los ($campos) los VALORES de ($datos)
        // echo $sql.'<br>'; // Mostramos la instrucción SQL resultante
        $this->_db->query($sql); // Ejecutamos la consulta 
    }

    /* Método para la actualización de datos */
    public function actualizar($valores) {
        $sql = "UPDATE $this->tabla SET "; // ACTUALIZAR $tabla ESTABLECIENDO
        // Para cada $valores como $key => value
        foreach( $valores as $key => $value ) {
            // Agregamos a la instrucción sql los campos ($key) y los valores ($value)
            $sql .= $key."='".$value."',";
        }
        $sql= substr($sql,0,strlen($sql)-1); // Quitamos el último caracter (,) a $sql
        // Agregamos a la instrucción el criterio
        $sql .= " WHERE $this->criterio"; // DONDE $criterio
        // echo $sql.'<br>'; // Mostramos la instrucción SQL resultante
        $this->_db->query($sql); // Ejecutamos la consulta 
    }

    /* Método para la eliminación de datos */
    public function eliminar() {
        // Guardamos en la variable $sql la instrucción DELETE
        $sql= "DELETE FROM $this->tabla WHERE $this->criterio"; // ELIMINAR DESDE $tabla DONDE $criterio
        $this->_db->query($sql); // Ejecutamos la consulta 
    }

}
?>