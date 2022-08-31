<?php
    require_once 'modelos.php'; //Requerimos el archivo de clases modelo.php
    $jvalores= file_get_contents("php://input"); // Tomamos los valores que vienen del POST en formato JSON
    $valores= json_decode($jvalores); // Convertimos los valores JSON a Array Asociativo

    $usuario = "'".$valores->usuario."'"; //Guardamos en la variable $usuario
    $password = "'".$valores->password."'";

    $usuarios = new ModeloABM('usuarios');
    $usuarios->criterio = "usuario=$usuario AND password=$password";
    $datos = $usuarios->seleccionar();
    echo $datos;
?>