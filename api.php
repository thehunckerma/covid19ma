<?php
header('Access-Control-Allow-Origin: *'); 
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');
header('Content-Type: application/json');

$data = file_get_contents('php://input');
if($data === ""){
    die('{"msg":"Wrong Data"}');
}

if(end(json_decode($data))->pass !== "covidTango"){
    die('{"msg":"Wrong Password"}');
}

try
{
    $datacov = fopen("datacov.json", "w") or die('{"msg":"Couldn\'t open file."}');
    ftruncate($datacov, 0);
    fwrite($datacov, $data);
    fclose($datacov);
}
catch (Exception $e)
{
    echo '{"msg":"Unknown Error"}';
}
echo '{"msg":"Done"}';
