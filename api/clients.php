<?php

require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$user = getLoggedUser();
if ($user == null) {
    throw new Exception("No logged user");
}

$projectId = getSafely('project_id', $_GET);
$clientId = getSafely('client_id', $_GET);
$postData = getPostData();
$username = $user['username'];

if ($projectId != null) {
    $query = "SELECT username, project.project_id FROM project 
              LEFT JOIN project_user ON project.project_id=project_user.project_id 
              WHERE project.project_id=? AND username=?";
    $data = array($projectId, $username);
} elseif ($clientId != null) {
    $query = "SELECT username, client.client_id FROM project 
              LEFT JOIN project_user ON project.project_id=project_user.project_id 
              LEFT JOIN client ON client.project_id=project.project_id 
              WHERE client.client_id=? AND username=?";
    $data = array($clientId, $username);
} else {
    throw new Exception("Too few parameters");
}
$statement = doQuery($db, $query, $data);

if ($statement->rowCount() == 0) {
    throw new Exception("Unauthorized access");
}

if ($postData != null && $projectId != null) {
    $clientKey = $postData['clientKey'];
    if ($clientKey == null) {
        $clientKey = randString(10);
    }
    $query = "INSERT INTO client (project_id, client_key, client_name, user_insert) VALUES (?,?,?,?);";
    $data = array($projectId, $clientKey, $postData['clientName'], $username);
    doQuery($db, $query, $data);
}
if ($projectId != null) {
    echo json_encode(getClientsForProject($db, $projectId));
} elseif ($clientId != null) {
    $query = "SELECT client_id, client_name, client_key FROM client WHERE client_id=?";
    $data = array($clientId);
    $statement = doQuery($db, $query, $data);
    $response = $statement->fetch(PDO::FETCH_ASSOC);
    $client = array(
        'clientId' => $clientId,
        'clientName' => $response['client_name'],
        'clientKey' => $response['client_key'],
        'sensors' => getSensorsForClient($db, $clientId)

    );
    echo json_encode($client);
}
