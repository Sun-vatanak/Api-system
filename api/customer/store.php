
<?php
require_once './../../boostarp.php'; // Include bootstrap file for database connection
$db = new Database();
// Get form data from POST request
$invoice_number = strval($_POST['invoice_number']);
$product_name = strval($_POST['product_name']);
$total_amount = floatval($_POST['total_amount']);
$buyer_name = strval($_POST['buyer_name']);
$buyer_phone = strval($_POST['buyer_phone']);
$discount = floatval($_POST['discount']);
$seller_name = strval($_POST['seller_name']);
$seller_phone = strval($_POST['seller_phone']);
$description = strval($_POST['description']);
// SQL query to insert invoice
$query = " insert into invoices (invoice_number, product_name, total_amount, buyer_name, buyer_phone, discount, seller_name, seller_phone, description) 
   values(:invoice_number, :product_name, :total_amount, :buyer_name, :buyer_phone, :discount, :seller_name, :seller_phone, :description)";

$params = [
    'invoice_number' => $invoice_number,
    'product_name' => $product_name,
    'total_amount' => $total_amount,
    'buyer_name' => $buyer_name,
    'buyer_phone' => $buyer_phone,
    'discount' => $discount,
    'seller_name' => $seller_name,
    'seller_phone' => $seller_phone,
    'description' => $description
];

$db->execute($query, $params);
echo json_encode([
    'status' => true,
    'message' => 'Invoice created successfully'
]);
?>
