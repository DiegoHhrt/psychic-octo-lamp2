<?php

define('DBUSER', 'octolamper');
define('DBHOST', 'localhost');
define('PASSWORD', 'mArat0n0ctOl4mP');
define('DB', 'octodb');

function conectar_base()
{
    $conexion = mysqli_connect(DBHOST, DBUSER, PASSWORD, DB);
    return $conexion;
}

// EOF