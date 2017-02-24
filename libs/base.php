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
function doQuery($db, $query, $data)
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
    if ($array == null) {
        return null;
    }
    if (array_key_exists($key, $array)) {
        return $array[$key];
    }
    return null;
}

function randString($length = 10)
{
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

function getPostData()
{
    $postData = file_get_contents('php://input');
    $data = json_decode($postData, true);
    if (count($data) > 0)
        return $data;
    else
        return null;
}


$db = initDatabase();
$db->setAttribute(PDO::ATTR_EMULATE_PREPARES, TRUE);


function getSensorsForClient($db, $clientId)
{
    $query = "SELECT sensor_id, sensor_name FROM client
          LEFT JOIN sensor ON client.client_id=sensor.client_id        
          WHERE client.client_id=?";
    $data = array($clientId);
    $sensorStatement = doQuery($db, $query, $data);
    $sensors = array();
    while ($sensor = $sensorStatement->fetch(PDO::FETCH_ASSOC)) {
        $sensorId = $sensor['sensor_id'];
        $query = "SELECT * FROM sensor_value WHERE sensor_id=? ORDER BY date_insert DESC LIMIT 1;";
        $data = array($sensorId);
        $valueStatement = doQuery($db, $query, $data);
        $lastValue = $valueStatement->fetch(PDO::FETCH_ASSOC);
        if ($sensorId != null) {
            array_push($sensors, array(
                    'sensorId' => $sensorId,
                    'sensorName' => $sensor['sensor_name'],
                    'lastValue' => array('value' => $lastValue['value'], 'dateInsert' => $lastValue['date_insert'])
                )
            );
        }
    }
    return $sensors;
}

function getClientsForProject($db, $projectId)
{
    $query = "SELECT client_id, client_name FROM project
          LEFT JOIN client ON project.project_id=client.project_id        
          WHERE project.project_id=?";
    $data = array($projectId);
    $statement = doQuery($db, $query, $data);
    $clients = array();
    while ($client = $statement->fetch(PDO::FETCH_ASSOC)) {
        if ($client['client_id'] != null) {
            array_push($clients, array(
                    'clientId' => $client['client_id'],
                    'clientName' => $client['client_name'],
                    'sensors' => getSensorsForClient($db, $client['client_id'])
                )
            );
        }
    }
    return $clients;
}