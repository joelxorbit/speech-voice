<?php
session_start();
include("include/dbconnect.php");
extract($_POST);
$msg="";
if(isset($login))
{

			$qry = "select * from pet_admin where username='$uname' && password='$pwd' && utype='Admin'";
			$exe=mysqli_query($connect,$qry);
			$num=mysqli_num_rows($exe);
				if($num==1)
				{
				$_SESSION['uname']=$uname;
				header("location:admin.php");
				}
				else
				{
				$msg="Login Incorrect!";
				}
		
}
?>
<html>
<head>
<title><?php include("include/title.php"); ?></title>
<link href="style.css" rel="stylesheet" type="text/css">
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<style type="text/css">
<!--
.style3 {color: #FFFFFF}
-->
</style>
	<link href="css/style_menu.css" rel="stylesheet" media="all">
</head>

<body class="body2">
<form id="form1" name="form1" method="post" action="">
<div class="page-wrapper bg-gra-03 p-t-45 p-b-50">
        <div class="wrapper wrapper--w790">
            
               
               
			   
        </div>
    </div>

    <!-- Jquery JS-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <!-- Vendor JS-->
    <script src="vendor/select2/select2.min.js"></script>
    <script src="vendor/datepicker/moment.min.js"></script>
    <script src="vendor/datepicker/daterangepicker.js"></script>

    <!-- Main JS-->
    <script src="js/global.js"></script>
  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
    <tr>
      <td align="center"><?php include("include/header.php"); ?></td>
    </tr>
    <tr>
      <td height="25" align="center" class="subhead"><?php include("include/link_home.php"); ?></td>
    </tr>
    <tr>
      <td align="center" valign="top"><p>&nbsp;</p>
        <p>&nbsp;</p>
        <p align="center">&nbsp;</p>
        <table width="236" height="257" border="0" cellpadding="5" cellspacing="0" class="bg2">
        <tr>
          <td align="center"><span class="txt3">Administrator</span></td>
          </tr>
        <tr>
          <td align="center" class="msg"><?php echo $msg; ?></td>
          </tr>
        <tr>
          <td class="txt1">Username</td>
          </tr>
        <tr>
          <td class="txt1"><input name="uname" type="text" /></td>
          </tr>
        <tr>
          <td class="txt1">Password</td>
          </tr>
        <tr>
          <td class="txt1"><input name="pwd" type="password" /></td>
          </tr>
        <tr>
          <td align="left"><input name="login" type="submit" value="Login" /></td>
          </tr>
        <tr>
          <td align="center"><span class="style3"><a href="register.php"></a></span></td>
          </tr>
      </table>
      <p>&nbsp;</p></td>
    </tr>
    <tr>
      <td align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>
