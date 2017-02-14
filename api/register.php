<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$rawData = json_decode($_POST['data'], true);

$username = $rawData['username'];
if (strlen($username) < 4 && strlen($username) > 10) {
    throw new Exception("Wrong username length");
}

if (strlen($rawData['password']) < 5 && strlen($rawData['password']) > 50) {
    throw new Exception("Wrong password length");
}

$data = array(
    $rawData['name'],
    $username,
    $rawData['email'],
    password_hash($rawData['password'], PASSWORD_DEFAULT)
);

$query = "INSERT INTO user (name,username,email,pass) VALUES (?,?,?,?);";

do_query($db, $query, $data);

$data = array($username);
$query = "SELECT * FROM user WHERE username=?";
$statement = do_query($db, $query, $data);

foreach ($statement as $row) {
    echo json_encode($row);
}