<?php
//Create a new SQLite3 Database items.db
$db = new SQLite3('../items.db');

//Create a new table items in database 
/*$query = "CREATE TABLE IF NOT EXISTS items (
    item_name STRING,
    UNIQUE(item_name) 
    )";
$db->exec($query);*/
//insert query
/*$sql = "INSERT INTO items (item_name) VALUES ('saida')";
$db->exec($sql);*/
/*$sql = "SELECT * FROM items";
$query = $db->query($sql);

while($row = $query->fetchArray()){
    echo "
        <ul>
            <li>".$row['item_name']."</li> 
        </ul>
    ";
}*/
