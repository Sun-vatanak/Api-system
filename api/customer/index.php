<?php 
require_once './../../boostarp.php';
$db = new Database();
// $name=strval($_POST['name']);
$sql="select  * from invoices ";
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
        'message' => 'get date successfully',
        'data' =>$provice
        ]
);