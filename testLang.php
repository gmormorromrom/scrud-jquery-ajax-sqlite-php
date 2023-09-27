<?php
require_once 'lib/tran.php';
require_once 'vendor/autoload.php'; // Autoloader for Symfony Yaml

use Symfony\Component\Yaml\Yaml;

// Charger les fichiers de traduction YAML
$translations_en = Yaml::parseFile('translations/en.yaml');
$translations_fr = Yaml::parseFile('translations/fr.yaml');
echo trans("goodbye",'en').'<br>';

echo trans("goodbye",'fr').'<br>';