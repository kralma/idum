<?php

require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$user = getLoggedUser();
if ($user == null) {
    throw new Exception("No logged user");
}

$clientId = getSafely('client_id', $_GET);
$postData = getPostData();
$username = $user['username'];

if ($clientId != null) {
    $query = "SELECT username, project.project_id FROM project 
              LEFT JOIN project_user ON project.project_id=project_user.project_id 
              LEFT JOIN client ON project.project_id=client.project_id 
              WHERE client.client_id=? AND username=?";
    $data = array($clientId, $username);
    $statement = doQuery($db, $query, $data);
    if ($statement->rowCount()) {
        throw new Exception("Unauthorized access");
    }
    if ($postData != null) {
        $query = "INSERT INTO sensor (client_id, sensor_name, can_read, can_write) VALUES (?,?,?,?);";
        $data = array($clientId, $postData['sensorName'], $postData['canRead'], $postData['canWrite']);
        doQuery($db, $query, $data);
    }

    echo json_encode(getSensorsForClient($db, $clientId));
}