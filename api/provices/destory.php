<?php 
require_once './../../boostarp.php';
$db =new Database();
$db->execute('delete from provinces where id=:id',['id' =>intval(value: $_GET['id'])]);
echo json_encode(  [
        'status' => true,
        'message' => 'Province deleted successfully'
        ]
);