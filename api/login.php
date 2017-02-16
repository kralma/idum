<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

$postData = getPostData();
if (count($postData) > 0) {
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