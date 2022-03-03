<?php

function preguntaRand() {



}

require './config.php';

$conexion = conectar_base(); //Inicio de la conexión con la base de datos.

//$json = json_decode(file_get_contents('php://input'), true);
//$email = $json['email'];


//header('Content-type: application/json');

// TODO:: BORRAD VARIABLES DE PRUEBA.
$tema = 3;
$preguntasYaHechas = [24, 65, 22];
$preguntasYaHechas = implode(',',$preguntasYaHechas);

// Petición para obtener una pregunta acerca del tema recibido
$query = "SELECT id_pregunta, pregunta  FROM pregunta WHERE id_tema='$tema' AND id_pregunta NOT IN($preguntasYaHechas) ORDER BY RAND() LIMIT 1";
$resultado = mysqli_query($conexion, $query);
$pregunta = mysqli_fetch_assoc($resultado);


// Petición para obtener las respuestas de la pregunta
$query_respuestas = "SELECT respuesta, correcta FROM preguntahasrespuesta 
                     INNER JOIN preguntahasrespuesta.id_respuesta=respuesta.id_respuesta
                     WHERE id_pregunta=$pregunta[id_pregunta]";

$resultado_pregunta = mysqli_query($conexion, $query_respuestas);

//$respuesta = mysqli_fetch_assoc($resultado_pregunta);




mysqli_close($conexion); //Finalizando la conexión con la base de datos




//if (mysqli_num_rows($resultado) === 1) {
    //echo json_encode($respuest);
//} else {
//    echo json_encode(false);
//}


// EOF
