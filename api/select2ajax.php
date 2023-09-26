<?php
include "../dbconfig.php";
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');
header('Allow: GET');
// Check the request method
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['q'])) {
        $q = htmlspecialchars($_GET['q']);
        $sql = 'SELECT * FROM items WHERE item_name LIKE :q;';
        $statement = $db->prepare($sql);
        $statement->bindValue(':q', '%' . $q . '%');

        $result = $statement->execute();
        $num_rows = $result->numColumns();
        $data = array();
        $count = 0;

        while ($row = $result->fetchArray()) {
            $count++;
            $data[] = ['name' => $row['item_name']];
        }
        $db->close();
        if ($count == 0) { 
            $data[] = ['name' => 'No items found'];
        }
        // Handle GET request
        header("HTTP/1.1 200 OK");
        echo json_encode($data);
    }
} else {
    // Handle other request methods or return an error
    http_response_code(405); // Method Not Allowed
    echo "Unsupported request method: " . $_SERVER['REQUEST_METHOD'];
}
