<?php 
require_once './../../boostarp.php';
$db = new Database();
// $name=strval($_POST['name']);
$sql="select  id ,name from provinces ";
$parmas=[];
if(isset($_GET['search'])){
    $search=strval($_GET['search']);
    $sql.="where name like :s";
    $parmas['s']= '%' .$search. '%';
}
// $db->execute('');
$provice =$db->executeAssoc($sql,$parmas);
echo json_encode(  [
        'status' => true,
        'message' => 'Province created successfully',
        'data' =>$provice
        ]
);