<?php

require './config.php';

$conexion = conectar_base(); //Inicio de la conexión con la base de datos.

// Recibiendo los datos
$json = json_decode(file_get_contents('php://input'), true);
$temaId = $json['temaId'];
$preguntasYaHechas = $json['preguntasYaHechas']
$preguntasYaHechas = implode(',',$preguntasYaHechas);

header('Content-type: application/json');

// Petición para obtener una pregunta acerca del tema recibido
$query = "SELECT id_pregunta, pregunta  FROM pregunta WHERE id_tema='$temaId' AND id_pregunta NOT IN($preguntasYaHechas) ORDER BY RAND() LIMIT 1";
$resultado = mysqli_query($conexion, $query);
$pregunta = mysqli_fetch_assoc($resultado);

$id_pregunta = $pregunta["id_pregunta"];

// Petición para obtener las respuestas de la pregunta
$query_respuestas = "SELECT respuesta FROM preguntahasrespuesta INNER JOIN respuesta ON preguntahasrespuesta.id_respuesta=respuesta.id_respuesta WHERE id_pregunta=$id_pregunta";

$resultado_respuestas = mysqli_query($conexion, $query_respuestas);

$arreglo[] = 0; ;



while($respuestas=mysqli_fetch_assoc($resultado_respuestas)) {
        array_push($arreglo, $respuestas);
}

unset($arreglo[0]);
$envio[] = array_merge($pregunta, $arreglo);



mysqli_close($conexion); //Finalizando la conexión con la base de datos




 if ($envio) {
     echo json_encode($envio, JSON_UNESCAPED_UNICODE);
 } else {
     echo json_encode(false);
}

// EOF
