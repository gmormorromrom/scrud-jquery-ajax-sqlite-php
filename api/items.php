<?php
include "../dbconfig.php";
// Function to send API requests
function apiRequest($url, $method = 'GET', $data = null)
{
    $options = [
        'http' => [
            'method' => $method,
            'header' => 'Content-Type: application/json',
            'content' => json_encode($data),
        ],
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    return json_decode($response, true);
}
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');
header('Allow: POST,OPTIONS,HEAD,GET,TRACE, DELETE');
// Check the request method
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM items DESC";
    $query = $db->query($sql);

    $data = array();

    while ($row = $query->fetchArray()) {
        $data[] = ["name" => $row['item_name']];
    }
    // Handle GET request
    header("HTTP/1.1 200 OK");
    echo json_encode($data);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_SERVER['CONTENT_TYPE'] === 'application/json; charset=utf-8') {
        // ################# POST #########################
        // Récupérez les données JSON de la demande POST
        $input = file_get_contents('php://input');
        $POST = json_decode($input, true); // Le deuxième argument true permet de décoder en tant que tableau 
        // print_r($POST);die;
        // Traitez les données JSON, par exemple, en les enregistrant dans une base de données
        // Remplacez cette étape par votre propre logique de traitement 
        if (isset($POST["newItem"])) {
            if (empty($POST["newItem"])) {
                header("HTTP/1.1 400 Bad Request");
                echo json_encode(['status' => '400 Bad Request', 'message' => 'data is empty.']);
                exit();
            }
            //insert query
            $input = htmlspecialchars($POST["newItem"], ENT_QUOTES, 'UTF-8');
            $sql = "INSERT INTO items (item_name) VALUES ('" . $input . "')";
            $db->exec($sql);
            // Répondez avec le code de statut 201 (Created)
            header("HTTP/1.1 201 Created");
            echo json_encode(array('message' => 'data created successfully.'));
            exit();
        }
        // ################# END POST #######################
        // ################# DELETE #########################
        // Handle DELETE request
        if (isset($POST["deletedItem"])) {
            if (empty($POST["deletedItem"])) {
                header("HTTP/1.1 400 Bad Request");
                echo json_encode(['status' => '400 Bad Request', 'message' => 'data is empty.']);
                exit();
            }
            // You can extract item ID from the request URL or payload and delete accordingly
            $itemToDelete = htmlspecialchars($POST["deletedItem"], ENT_QUOTES, 'UTF-8');; // Replace with your logic to get the item ID to delete
            //delete the row of selected id
            $sql = "DELETE FROM items WHERE item_name = '" . $itemToDelete . "'";
            $db->query($sql);
            // $deletedItem = apiRequest('https://votre-api.com/api/items/' . $itemIdToDelete, 'DELETE');
            header("HTTP/1.1 204 No Content");
            echo json_encode(array('message' => 'data deleted successfully.'));
            exit();
        }

        // ################# END DELETE ##################### 
        // ################# UPDATE  ######################## 
        if (isset($POST["editItem"]) && isset($POST["choicedItem"])) {
            if (empty($POST["editItem"]) || empty($POST["choicedItem"])) {
                header("HTTP/1.1 400 Bad Request");
                echo json_encode(['status' => '400 Bad Request', 'message' => 'some of data is or are empty.']);
                exit();
            }
            // You can extract item ID from the request URL or payload and delete accordingly
            $itemToUpdate = htmlspecialchars($POST["choicedItem"], ENT_QUOTES, 'UTF-8');; // Replace with your logic to get the item ID to delete
            $itemChangeTo = htmlspecialchars($POST["editItem"], ENT_QUOTES, 'UTF-8');; // Replace with your logic to get the item ID to delete
            //delete the row of selected id
            //update our table
            $sql = "UPDATE items SET item_name = '" . $itemChangeTo . "' WHERE item_name = '" . $itemToUpdate . "'";
            $db->exec($sql);
            // $deletedItem = apiRequest('https://votre-api.com/api/items/' . $itemIdToDelete, 'DELETE');
            header("HTTP/1.1 204 No Content");
            echo json_encode(array('message' => 'data updated successfully.'));
            exit();
        }
        // ################# END UPDATE #####################
        // ################# SEARCH ######################### 
        if (isset($POST["searchItem"])) {
            if (empty($POST["searchItem"])) {
                header("HTTP/1.1 400 Bad Request");
                echo json_encode(['status' => '400 Bad Request', 'message' => 'some of data is or are empty.']);
                exit();
            }
            // You can extract item ID from the request URL or payload and delete accordingly
            $itemSearch = htmlspecialchars($POST["searchItem"], ENT_QUOTES, 'UTF-8');; // Replace with your logic to get the item ID to delete
            //delete the row of selected id
            //update our table
            $sql = "SELECT * FROM items WHERE item_name = '" . $itemSearch . "'";
            $query = $db->query($sql);

            $data = array();

            while ($row = $query->fetchArray()) {
                $data[] = ["name" => $row['item_name']];
            }
            // Handle GET request
            header("HTTP/1.1 200 OK");
            echo json_encode($data);

            exit();
        }
        // ################# END SEARCH ##################### 


    } else {
        // Handle other request methods or return an error
        http_response_code(405); // Method Not Allowed
        echo "Unsupported content type: " . $_SERVER['CONTENT_TYPE'];
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Handle PUT request
    // You can extract item ID from the request URL or payload and update accordingly
    $itemId = 1; // Replace with your logic to get the item ID to update
    $updatedItemData = [
        'name' => 'Nom mis à jour',
        'description' => 'Description mise à jour',
    ];
    $updatedItem = apiRequest('https://votre-api.com/api/items/' . $itemId, 'PUT', $updatedItemData);
    print_r($updatedItem);
} else {
    // Handle other request methods or return an error
    http_response_code(405); // Method Not Allowed
    echo "Unsupported request method: " . $_SERVER['REQUEST_METHOD'];
}
