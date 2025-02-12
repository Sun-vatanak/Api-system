<?php 
require_once './../../boostarp.php';
$name=strval($_POST['name']);
$id=strval($_GET['id']);
$db=new Database();
$db->execute("update provinces set name=:name where id=:id",
['name'=>$name,'id'=>$id]
);
echo json_encode(  [
        'status' => true,
        'message' => 'Province updated successfully'
        ]
);
