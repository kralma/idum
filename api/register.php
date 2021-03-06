<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$rawData = getPostData();

$username = getSafely('username', $rawData);
$password = getSafely('password', $rawData);

if (strlen($username) < 4 && strlen($username) > 10) {
    throw new Exception("Wrong username length");
}

if (strlen($password) < 5 && strlen($password) > 50) {
    throw new Exception("Wrong password length");
}

$data = array(
    getSafely('name', $rawData),
    $username,
    getSafely('email', $rawData),
    password_hash($password, PASSWORD_DEFAULT)
);

$query = "INSERT INTO user (name,username,email,pass) VALUES (?,?,?,?);";

doQuery($db, $query, $data);

$data = array($username);
$query = "SELECT * FROM user WHERE username=?";
$statement = doQuery($db, $query, $data);

$user = $statement->fetch(PDO::FETCH_ASSOC);
echo json_encode($user);
setLoggedUser(array($user['username'], $user['name'], $user['user_id']));
