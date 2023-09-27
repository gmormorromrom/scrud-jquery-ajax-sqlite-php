<?php 
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Fonction de traduction
function trans($text, $language=null) {
    global $translations_en, $translations_fr;

    if ($language === 'fr' && isset($translations_fr[$text])) {
        return $translations_fr[$text];
    } elseif ($language === 'en' && isset($translations_en[$text])) {
        return $translations_en[$text];
    } else {
        return $text; // Retourner le texte original s'il n'y a pas de traduction
    }
}

// Déterminer la langue à utiliser (par défaut en anglais)
$langue = isset($_SESSION['langue']) ? $_SESSION['langue'] : 'en';