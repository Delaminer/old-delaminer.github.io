<?php

if (isset($_POST['login-submit'])) {

    require 'dbh.inc.php';

    $mailuid = $_POST['mailuid'];
    //See 1:19:16 at double speed

}
else {
    header("Location: ../project_index.php");
    exit();
}