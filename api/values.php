<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$postData = getPostData();
$user = getLoggedUser();
$username = getSafely('username', $user);
$client = null;

if ($postData != null) {
    $unapprovedSensorData = $postData['sensorValues'];
    $approvedSensorData = array();
    $clientId = getSafely('clientId', $postData);
    $clientKey = getSafely('clientKey', $postData);
    if ($clientId != null) {
        $client = array('clientId' => $clientId, 'clientKey' => $clientKey);
    }

    $query = "SELECT username, client.client_id, client_key, can_write, sensor_id FROM sensor
              RIGHT JOIN client ON client.client_id=sensor.client_id
              RIGHT JOIN project ON client.project_id=project.project_id
              LEFT JOIN project_user ON client.project_id=project_user.project_id
              WHERE (client.client_id=? AND client_key=? AND sensor.can_write=TRUE)
              OR project_user.username=?;";
    $data = array($clientId, $clientKey, $username);
    $statement = doQuery($db, $query, $data);
    foreach ($statement as $row) {
        foreach ($unapprovedSensorData as $i => $d) {
            if ($d['sensorId'] == $row['sensor_id']) {
                array_push($approvedSensorData, $d);
                unset($unapprovedSensorData[$i]);
                break;
            }
        }
    }
    if (count($approvedSensorData) > 0) {
        $query = $query . "INSERT INTO sensor_value (sensor_id, value) VALUES ";
        foreach ($approvedSensorData as $i => $d) {
            array_push($data, $d['sensorId'], $d['value']);
            $query = $query . "(?,?)";
            if ($i < count($approvedSensorData) - 1) {
                $query = $query . ",";
            }
        }
        $query = $query . ";";
        doQuery($db, $query, $data);
    } else {
        echo "Permission denied";
    }
}

if (array_key_exists('sensorId', $_GET)) {
    $sensorId = $_GET['sensorId'];
    $query = "";
    $data = array();
    if ($username != null) {
        $query = "SELECT sensor_id, username FROM sensor
                  RIGHT JOIN client ON client.client_id=sensor.client_id
                  RIGHT JOIN project ON client.project_id=project.project_id
                  LEFT JOIN project_user ON client.project_id=project_user.project_id
                  WHERE sensor_id=? AND project_user.username=?;";
        $data = array($sensorId, $username);
    } elseif ($client != null) {
        $query = "SELECT client.client_id, sensor_id, value FROM sensor
                  RIGHT JOIN client ON client.client_id=sensor.client_id
                  RIGHT JOIN project ON client.project_id=project.project_id
                  WHERE sensor_id=? AND client.client_id=? AND client_key=? AND can_read=TRUE;";
        $data = array($sensorId, $client['clientId'], $client['clientKey']);
    }
    $statement = doQuery($db, $query, $data);
    if ($statement->rowCount() > 0) {
        $query = "SELECT * FROM sensor_value WHERE sensor_id=?";
        $data = array($sensorId);
        $statement = doQuery($db, $query, $data);
        $values = array();
        foreach ($statement as $row) {
            $arr = array('sensorValueId' => $row['sensor_value_id'], 'sensorId' => $row['sensor_id'], 'dateInsert' => strtotime($row['date_insert']) * 1000, 'value' => $row['value']);
            array_push($values, $arr);
        }
        echo json_encode($values);
    } else {
        echo "Permission denied";
    }
}