<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (isset($_POST['langue']) && ($_POST['langue'] === 'en' || $_POST['langue'] === 'fr')) {
    $_SESSION['langue'] = $_POST['langue'];
}

// Rediriger l'utilisateur vers la page précédente (ou une autre page)
header('Location: ' . $_SERVER['HTTP_REFERER']);
exit;
