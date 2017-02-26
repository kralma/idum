<?php
require "../libs/base.php";
header("Content-Type: application/json; charset=UTF-8");

setLoggedUser(null);
echo json_encode(getLoggedUser());