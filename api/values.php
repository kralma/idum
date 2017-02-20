<?php
require "../libs/base.php";

$data = array();
$query = "";
header("Content-Type: application/json; charset=UTF-8");
$sensorId = null;

if (array_key_exists('sensor_id', $_GET)) {
    $sensorId = $_GET['sensor_id'];
}

if (array_key_exists("data", $_POST)) {
    $rawData = json_decode($_POST['data'], true);
    $query = $query . " INSERT INTO sensor_value (sensor_id, value) VALUES ";
    for ($i = 0; $i < count($rawData); $i++) {
        $d = $rawData[$i];
        array_push($data, $d['sensorId'], $d['value']);
        $query = $query . "(?,?)";
        if ($i != count($rawData) - 1) {
            $query = $query . ",";
        }
    }
    $query = $query . ";";
    doQuery($db, $query, $data);
}

$data = array();
if ($sensorId == null) {
    $query = "SELECT * FROM sensor_value;";
} else {
    array_push($data, $sensorId);
    $query = "SELECT * FROM sensor_value WHERE sensor_id=?;";
}

$statement = doQuery($db, $query, $data);
$ret = array();
foreach ($statement as $row) {
    $arr = array('sensorValueId' => $row['sensor_value_id'], 'sensorId' => $row['sensor_id'], 'dateInsert' => strtotime($row['date_insert']) * 1000, 'value' => $row['value']);
    array_push($ret, $arr);
}

echo json_encode($ret);

?>