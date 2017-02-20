<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$rawData = getPostData();
if (count($rawData) > 0) {
    $data = array(
        getSafely('username', $rawData)
    );
    $query = 'SELECT * FROM user WHERE username=?';
    $statement = doQuery($db, $query, $data);
    $userTemp = $statement->fetch(PDO::FETCH_ASSOC);
    $user = array(
        'username' => $userTemp['username'],
        'name' => $userTemp['name'],
        'email' => $userTemp['email'],
        'userId' => $userTemp['user_id']
    );

    if (password_verify(getSafely('password', $rawData), $userTemp['pass'])) {
        setLoggedUser($user);
    } else {
        setLoggedUser(null);
    }
}
echo json_encode(getLoggedUser());