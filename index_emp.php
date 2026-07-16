<?php
session_start();
include("include/dbconnect.php");
extract($_POST);
$msg="";
if(isset($login))
{
	$q4=mysqli_query($connect,"select * from pet_admin where username='$uname' && password='$pass' && utype='Officer'");
	$num=mysqli_num_rows($q4);


			if($num==1)
			{
			$rr2=mysqli_fetch_array($q4);
			
				$_SESSION['uname']=$uname;
				
				
				header("location:off_home.php");
			}
			else
			{
			$msg="Login Incorrect";
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
<script language="javascript">
function validate()
{
	if(document.form1.mobile.value=="")
	{
	alert("Enter the Mobile Number");
	document.form1.mobile.focus();
	return false;
	}
	if(isNaN(document.form1.mobile.value))
	{
	alert("Invaalid Mobile Number!");
	document.form1.mobile.select();
	return false;
	}
	if(document.form1.mobile.value.length!=10)
	{
	alert("Mobile Number must be 10 digits");
	document.form1.mobile.select();
	return false;
	}
return true;
}
</script>
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
  <table  border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
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
            <td align="center"><span class="txt3">Officer Login</span></td>
          </tr>
          <tr>
            <td align="center" class="msg"><?php echo $msg; ?></td>
          </tr>
          <tr>
            <td class="txt1">Username</td>
          </tr>
          <tr>
            <td class="txt1"><input name="uname" type="text" value="" /></td>
          </tr>
         
          <tr>
            <td class="txt1">Password</td>
          </tr>
          <tr>
            <td class="txt1"><input name="pass" type="password" /></td>
          </tr>
          <tr>
            <td align="left"><input name="login" type="submit" value="Login"  /></td>
          </tr>
        
          <tr>
            <td align="center"><span class="style3"></span></td>
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
