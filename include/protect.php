<?php
session_start();
if($_SESSION['uname']=="")
{
header("location:index.php");
}

?>