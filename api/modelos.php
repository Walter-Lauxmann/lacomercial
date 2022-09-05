<?php  
require_once("config.php"); // Incluímos el archivo de configuración con las constantes
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

/* Clase principal */
class Modelo{ 
    // Definimos la propiedad _db
    protected $_db; 
    // Creamos el constructor con la conexión a la Base de Datos
    public function __construct(){ 
        $this->_db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME); 
        // Si se produce un error de conexión, muestra un mensaje de error
        if ( $this->_db->connect_errno ){ 
            echo "Fallo al conectar a MySQL: ". $this->_db->connect_error; 
            return;     
        } 
        // Establecemos el conjunto de caracteres utf8
        $this->_db->set_charset(DB_CHARSET);
        $this->_db->query("SET NAMES 'utf8'"); 
    } 
} 
/* Fin de la clase principal */

/* Clase ModeloABM basada en Modelo */
class ModeloABM extends Modelo{
    private $tabla;         // nombre de la tabla
    private $id= 0;         // id del registro
    private $criterio= '';  // criterio para las consultas
    private $orden= 'id';   // campo de ordenamiento
    private $campos= '*';   // lista de campos
    private $limit= 0;      // cantidad de registros

    public function __construct($t){ 
        parent::__construct(); 
        $this->tabla= $t;
    }

    public function setTabla($tabla) {
        $this->tabla = $tabla;
    }
    public function getTabla() {
        return $this->tabla;
    }
    public function setId($id) {
        $this->id = $id;
    }
    public function getId() {
        return $this->id;
    }
    public function setCriterio($criterio) {
        $this->criterio = $criterio;
    }
    public function getCriterio() {
        return $this->criterio;
    }
    public function setOrden($orden) {
        $this->orden = $orden;
    }
    public function getOrden() {
        return $this->orden;
    }
    public function setCampos($campos) {
        $this->campos = $campos;
    }
    public function getCampos() {
        return $this->campos;
    }
    public function setLimit($limit) {
        $this->limit = $limit;
    }
    public function getLimit() {
        return $this->limit;
    }

    // Método de conexión 
    public function conexion(){
        return $this->_db;
    }
    // Método para seleccionar, entre paréntesis establecemos los parámetros
    public function seleccionar(){
        // Guardamos en la variable $sql la instrucción SELECT
        $sql =  "SELECT $this->campos FROM $this->tabla"; // SELECCIONAR $campos DESDE $tabla
        // Si el criterio NO es igual a NADA
        if($this->criterio != ''){
            // Agregamos el criterio
            $sql .= " WHERE $this->criterio"; // DONDE $criterio
        }
        // Agregamos el orden
        $sql .= " ORDER BY $this->orden";  // ORDENADO POR $orden
        // Si $limit es mayor que cero
        if($this->limit > 0){
            // Agregamos el límite
            $sql .= " LIMIT $this->limit"; // LIMITE $limit
        }
        //echo $sql.'<br />'; // mostramos la instruccón sql resultante
        $resultado = $this->_db->query($sql); // Ejecutamos la consulta la guardamos en $resultado
        $datos = $resultado->fetch_all(MYSQLI_ASSOC); // Guardamos los datos resultantes en un array asociativo
        $json_datos = json_encode($datos) ; // Convertimos los datos en formato JSON
        return $json_datos ; // Retornamos los datos en formato JSON
    }

    // Método para la inserción de datos
    public function insertar($valores){
        $campos='';
        $datos='';
        unset($valores->id);
        // Para cada $valores como $key => $value
        foreach ($valores as $key => $value) {
            $value= "'".$value."'"; // Agregamos apóstrofe (') antes y después de cada $value
            $campos .= $key.","; // Agregamos a la variable $campo el $key y una coma (,)
            $datos .= $value.",";// Agregamos a la variable $datos el $value y una coma (,)
        }        
        $campos= substr($campos,0,strlen($campos)-1); // Quitamos el último caracter (,) a $campos
        $datos= substr($datos,0,strlen($datos)-1);    // Quitamos el último caracter (,) a $datos
        // Guardamos en la variable $sql la instrucción INSERT
        $sql="INSERT INTO $this->tabla($campos) VALUES($datos)"; // INSERTAR DENTRO de $tabla en los ($campos) los VALORES de ($datos)
        //echo $sql.'<br />'; // Mostramos la instrucción sql resultante
        $resultado = $this->_db->query($sql); // Ejecutamos la consulta la guardamos en $resultado
    }

    // Método para la actualización de datos
    public function actualizar($valores){
        $sql="UPDATE $this->tabla SET "; // ACTUALIZAR $tabla ESTABLECIENDO
        // Para cada $valores como $key => $value
        foreach ($valores as $key => $value) {
            // Agregamos a la instrucción los campos ($key) y los valores ($value)
            $sql .= $key."='".$value."',"; 
        }
        $sql= substr($sql,0,strlen($sql)-1); // Quitamos el último caracter (,) a $sql
        // Agregamos a la instrucción el criterio
        $sql .= " WHERE $this->criterio"; // DONDE $criterio
        // echo $sql.'<br />'; // Mostramos la instruccón sql resultante
        $resultado = $this->_db->query($sql); // Ejecutamos la consulta la guardamos en $resultado
    }

    // Método para la eliminación de datos
    public function eliminar(){
        // Guardamos en la variable $sql la instrucción DELETE
        $sql="DELETE FROM $this->tabla WHERE $this->criterio"; // ELIMINAR DESDE $tabla DONDE $criterio
        $resultado = $this->_db->query($sql); // Ejecutamos la consulta la guardamos en $resultado
    }   
} 
?> 