<?php
include "../dbconfig.php";
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');
header('Allow: GET');

/**
 * (FR) - Vérifier la méthode de requête
 * (EN/US) - Check the request method
 */
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['q'])) {
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $q = htmlspecialchars($_GET['q']);
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $sql = 'SELECT * FROM items WHERE item_name LIKE :q;';
        /**
         * 
         */
        $statement = $db->prepare($sql);
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $statement->bindValue(':q', '%' . $q . '%');
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $result = $statement->execute();
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $num_rows = $result->numColumns();
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $data = array();
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $count = 0;
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        while ($row = $result->fetchArray()) {
            $count++;
            $data[] = ['name' => $row['item_name']];
        }
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        $db->close();
        /**
         * (FR) - Si le compteur à zero, retourner un element vide
         * (EN/US) - If the counter is zero, return an empty element
         */
        if ($count == 0) {
            $data[] = ['message' => '(FR) - Aucun élément trouvé, (EN/US) - No items found', 'name' => ''];
        }
        /**
         * (FR) - Gérer la requête GET
         * (EN/US) - Handle GET request
         */
        header("HTTP/1.1 200 OK");
        /**
         *  (FR) - 
         *  (EN/US) -
         */
        echo json_encode($data);
    }
} else {
    /**
     *  (FR) - Gérer d'autres méthodes de requête ou renvoyer une erreur
     *  (EN/US) - Handle other request methods or return an error
     */ 
    http_response_code(405); // (FR) - Méthode Non Autorisée, (EN/US) - Method Not Allowed
    echo " (FR) - Méthode de requête non prise en charge,(EN/US) - Unsupported request method: " . $_SERVER['REQUEST_METHOD'];
}
