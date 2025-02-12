<?php
require_once './../../boostarp.php';
$db = new Database();
$name=strval($_POST['name']);
$db->execute('insert into provinces (name) values (:name)',['name' =>$name]);
echo json_encode(  [
        'status' => true,
        'message' => 'Province created successfully'
        ]
);