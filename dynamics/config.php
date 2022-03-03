<?php

define('DBUSER', 'root');
define('DBHOST', 'localhost');
define('PASSWORD', '');
define('DB', 'octodb');

function conectar_base()
{
    $conexion = mysqli_connect(DBHOST, DBUSER, PASSWORD, DB);
    return $conexion;
}

// EOF