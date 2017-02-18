<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$user = getLoggedUser();
if ($user == null) {
    throw new Exception("No logged user");
}

$postData = getPostData();
$projectId = getSafely('project_id', $_GET);
$username = $user['username'];

if ($postData != null) {
    $query = "INSERT INTO project (name ,description, user_insert) VALUES (?,?,?);";
    $data = array($postData['projectName'], $postData['projectDescription'], $username);
    doQuery($db, $query, $data);
    $projectId = $db->lastInsertId();

    $query = "INSERT INTO project_user (project_id,username,project_user_role_id) VALUES (?,?,?);";
    $data = array($projectId, $username, 1);
    doQuery($db, $query, $data);
}

$query = "SELECT * FROM project
          LEFT JOIN project_user ON project.project_id=project_user.project_id
          WHERE username=?";
$data = array($username);
if ($projectId != null) {
    $query = $query . ' AND project.project_id=?';
    array_push($data, $projectId);
}
$statement = doQuery($db, $query, $data);
$response = array();
while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    array_push($response, array(
            'projectId' => $row['project_id'],
            'projectName' => $row['name'],
            'projectDescription' => $row['description'],
            'sensors' => getClientsForProject($db, $row['project_id'])
        )
    );
}
echo json_encode($response);
