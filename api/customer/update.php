<?php 
require_once './../../boostarp.php';
$name=strval($_POST['name']);
$id=strval($_GET['id']);
$db=new Database();
$db->execute("update invoices set
    invoice_number = :invoice_number, 
    product_name = :product_name, 
    total_amount = :total_amount, 
    buyer_name = :buyer_name, 
    buyer_phone = :buyer_phone, 
    discount = :discount, 
    seller_name = :seller_name, 
    seller_phone = :seller_phone, 
    description = :description  where id = :id;
",
['name'=>$name,'id'=>$id]
);
echo json_encode(  [
        'status' => true,
        'message' => ' updated successfully'
        ]
);
