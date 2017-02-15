<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$postData = file_get_contents('php://input');
if (strlen($postData) > 0) {
    $rawData = json_decode($postData, true);
    $data = array(
        getSafely('username', $rawData),
    );
    $query = 'SELECT * FROM user WHERE username=?';
    $statement = do_query($db, $query, $data);
    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if (password_verify(getSafely('password', $rawData), $user['pass'])) {
        setLoggedUser($user);
    } else {
        echo "invalid username or password";
    }
}
echo json_encode(getLoggedUser());