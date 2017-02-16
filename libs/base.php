<?php
/**
 * Create database connection
 * @param none
 * @return PDO database
 */

session_start();

function initDatabase()
{
//$dbname = "mysql:dbname=idumwzcz7478;host=185.64.219.6";
    $dbname = "mysql:dbname=idumwzcz7478;host=localhost";
    $user = "idumwzcz7478";
    $pass = "db5555";
    try {
        $db = new PDO($dbname, $user, $pass);
        $db->query("SET NAMES utf8");
        return $db;
    } catch (PDOException $e) {
        echo $e;
        return null;
    }
}

/**
 * Do SQL query
 * @param db PDO database
 * @param query string query
 * @param data array data for query
 * @return PDOStatement result
 */
function do_query($db, $query, $data)
{
    $statement = $db->prepare($query);
    $statement->execute($data);
    return $statement;
}

function setLoggedUser($user)
{
    $_SESSION['user'] = $user;
}

function getLoggedUser()
{
    if (array_key_exists('user', $_SESSION)) {
        return $_SESSION['user'];
    } else {
        return null;
    }
}

function getSafely($key, $array)
{
    if (array_key_exists($key, $array)) {
        return $array[$key];
    } else return null;
}

function getPostData()
{
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);
    return $data;
}


$db = initDatabase();
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, TRUE);
?>