<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
require_once 'lib/tran.php';
require_once 'vendor/autoload.php';

use Symfony\Component\Yaml\Yaml;

// Charger les fichiers de traduction YAML
$translations_en = Yaml::parseFile('translations/en.yaml');
$translations_fr = Yaml::parseFile('translations/fr.yaml');
// Déterminer la langue à utiliser (par défaut en anglais)
$langue = isset($_SESSION['langue']) ? $_SESSION['langue'] : 'en';
?>
<!DOCTYPE html>
<html lang="<?= $langue ?>">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= trans('list of elements', $langue) ?></title>
    <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png">
    <link rel="manifest" href="/images/site.webmanifest">
    <link rel="stylesheet" href="/library/bootstrap/5.2.3/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/library/select2/4.0.12/dist/css/select2.css" />
    <link rel="stylesheet" href="/library/select2-bootstrap-5-theme-1.3.0/select2-bootstrap-5-theme.css" />
    <link rel="stylesheet" href="/library/bootstrap-icons/1.10.4/font/bootstrap-icons.css" />
    <link rel="stylesheet" href="/library/DataTables-1.10.21/media/css/jquery.dataTables.min.css" />

    <script src="/library/jquery/3.7.1/jquery-3.7.1.js"></script>
    <script src="/library/bootstrap/5.2.3/js/bootstrap.bundle.min.js"></script>
    <script src="/library/select2/4.0.12/dist/js/select2.full.js"></script>
    <script src="/library/select2/4.0.12/dist/js/i18n/fr.js"></script>
    <script src="/library/select2/4.0.12/dist/js/i18n/en.js"></script>
    <script src="/library/DataTables-1.10.21/media/js/jquery.dataTables.js"></script>
    <script src="crud.js"></script>
    <style>
        .custom-select {
            margin-bottom: 10px;
            /* Ajustez la valeur en pixels selon l'espace souhaité */
        }

        .card {
            margin-bottom: 10px;
            /* Ajustez la valeur en pixels selon l'espace souhaité */
        }

        .red-border {
            border-color: red;
            /* Ajoutez une classe pour la bordure rouge */
        }

        .blue-border {
            border-color: skyblue;
            /* Ajoutez une classe pour la bordure rouge */
        } 
    </style>
</head>

<body>
    <div class="row">
        <div class="col-4">
            <form method="post" action="changeLanguage.php">
                <div class="align-horizontal">
                    <!-- <label for="langue"><?= ucfirst(trans('choose your language', $langue)) ?> :</label> -->
                    <select name="langue" id="select-lang-form" class="form-select">
                        <option value="" <?php if ($langue === "")  echo 'selected';  ?>><?= ucfirst(trans('choose your language', $langue)) ?></option>
                        <option value="en" <?php if ($langue === "en")  echo 'selected';  ?>><?= trans('english', $langue) ?></option>
                        <option value="fr" <?php if ($langue === "fr")  echo 'selected';  ?>><?= trans('french', $langue) ?></option>
                    </select>
                    <input type="submit" class="btn btn-sm btn-primary" value="<?= trans('change the language', $langue) ?>">
                </div> 
            </form>
        </div>
        <div class="col-4"></div>
        <div class="col-4"></div>
    </div>

    <h1><?php echo ucfirst(trans('list of elements', $langue)); ?></h1>
    <div class="row">
        <div class="col-4">
            <div class="card">
                <div class="card-header"><?= trans('add an item', $langue) ?></div>
                <div class="card-body">
                    <!-- <ul id="item-list"></ul> -->
                    <form method="post" id="add-item-form">
                        <div id="error-message" class="text-danger"></div>
                        <input type="text" id="new-item" name="newItem" class="form-control" placeholder="<?= trans('new item', $langue) ?>"><br>
                        <button id="add-item" class="btn btn-primary"><?= trans('add', $langue) ?></button>
                    </form>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><?= trans('edit an item', $langue) ?></div>
                <div class="card-body">
                    <form method="post" id="update-item-form" class="form-group">
                        <div class="form-group custom-select">
                            <!-- <label for="update-select-item">Choisir l'élément</label> -->
                            <select class="selectItem form-select" name="state" id="update-select-item">
                                <!-- here is contents -->
                                <option value="" selected><?= trans('choose item', $langue) ?></option>
                            </select>
                        </div>
                        <!-- <input type="text" id="choice-item" name="choiceItem" class="form-control"
                            placeholder="Choisir élément"><br> -->
                        <div id="error-message" class="text-danger"></div>
                        <input type="text" id="edit-item" name="editItem" class="form-control" placeholder="<?= trans('edit item', $langue) ?>"><br>
                        <button id="update-item" class="btn btn-info"><?= trans('update', $langue) ?></button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card">
                <div class="card-header"><?= trans('delete an item', $langue) ?></div>
                <div class="card-body">
                    <form method="post" id="remove-item-form">
                        <input type="text" id="delete-item" name="deleteItem" class="form-control" placeholder="<?= trans('delete item', $langue) ?>"><br>
                        <button id="remove-item" class="btn btn-danger"><?= trans('delete', $langue) ?></button>
                    </form>
                </div>
            </div>
            <div class="card">
                <div class="card-header"><?= trans('search an item', $langue) ?></div>
                <div class="card-body">
                    <form method="post" id="search-item-form">
                        <input type="text" id="search-item" name="searchItem" class="form-control" placeholder="<?= trans('search item', $langue) ?>"><br>
                        <button id="search-button" class="btn btn-success"><?= trans('search', $langue) ?></button>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-4">
            <h2><?= trans('name of items', $langue) ?></h2>
            <!-- liste des elements -->
            <table class="table display" id="table-item" style="width:100%">
                <thead>
                    <tr>
                        <th><?= trans('name', $langue) ?></th>
                    </tr>
                </thead>
                <tbody id="item-list">
                    <!-- ajouter ici -->
                </tbody>
            </table>
        </div>
    </div>

</body>

</html>