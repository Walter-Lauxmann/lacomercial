<?php
require_once 'modelos.php'; //Requerimos el archivo de clases modelo.php
$mensaje= '';
if(isset($_GET['tabla'])) {  // Si está seteada GET['tabla']
    $tabla= new ModeloABM($_GET['tabla']); // Creamos el objeto $tabla desde la clase ModeloABM
    if (isset($_GET['criterio'])) {
        $tabla->set_criterio($_GET['criterio']);
    }
    if (isset($_GET['id'])){     // Si está seteada GET['id']
        if($_GET['id'] != '0'){ // Si GET['id'] NO es igual a 0
            $tabla->set_criterio("id=".$_GET['id']); // Establecemos el criterio a id= al id seteado
        }
    }

    if (isset($_GET['accion'])){ // Si está seteada GET['accion']
        if ($_GET['accion'] == 'insertar' || $_GET['accion'] == 'actualizar'){ // Si la accion es insertar o actualizar
            $valores = $_POST;  // Tomamos los valores que vienen del POST
            if (                                       // si
                isset($_FILES) &&                      // está seteado $_FILES Y
                isset($_FILES['imagen']) &&            // está seteado $_FILES['imagen'] Y
                !empty($_FILES['imagen']['name'] &&    // NO está vacío $_FILES['imagen']['name'] Y
                !empty($_FILES['imagen']['tmp_name'])) // NO está vacío $_FILES['imagen']['tmp_name']
                ) {
                //Hemos recibido el archivo
                //Comprobamos que es un archivo subido por PHP, y no hay inyección por otros medios
                if (is_uploaded_file($_FILES['imagen']['tmp_name'])) {  // si está subido el archivo $_FILES['imagen']['tmp_name'])
                    $tmp_nombre = $_FILES['imagen']['tmp_name'];        // Guardamos el nombre temporal en $tmp_nombre
                    $nombre = $_FILES['imagen']['name'];                // Guardamos el nombre en $nombre
                    $destino = '../imagenes/productos/'.$nombre;        // Guardamos la ruta en $destino

                    if (move_uploaded_file($tmp_nombre, $destino)) {    // Si podemos mover el archivo
                        $mensaje .= "Archivo subido correctamente a: ".$destino."<br>";
                        $valores['imagen'] = $nombre;                   // Guardamos en el atributo "imagen" el nombre del archivo
                    } else {                                            // sino
                        $mensaje .= "Error: No se ha podido mover el archivo enviado a la carpeta de destino<br>";
                        unlink(ini_get('upload_tmp_dir').$_FILES['imagen']['tmp_name']);  // Eliminamos el archivo temporal subido
                    }
                } else {                                                // sino
                    $mensaje .="Error: El archivo encontrado no fue procesado por la subida correctamente.<br>";
                }
            }
        }
        switch ($_GET['accion']) {
            case 'seleccionar':
                $datos= $tabla->seleccionar();
                echo $datos;
                break;

            case 'insertar':
                //print_r($valores);
                $tabla->insertar($valores);
                $mensaje .= 'Datos guardados';
                echo json_encode($mensaje);
                break;

            case 'actualizar':
                //print_r($valores);
                $tabla->actualizar($valores);
                $mensaje .= 'Datos guardados';
                echo json_encode($mensaje);
                break;

            case 'eliminar':
                $tabla->eliminar();
                $mensaje .= 'Dato eliminado';
                echo json_encode($mensaje);
                break;
        }
    }
}
?>