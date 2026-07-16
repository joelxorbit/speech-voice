<?php
session_start();
include("include/dbconnect.php");
extract($_POST);
$msg="";
$uname=$_SESSION['uname'];

$qq1=mysqli_query($connect,"select * from pet_register where uname='$uname'");
$rr1=mysqli_fetch_array($qq1);
$otp=$rr1['otp'];
$mobile=$rr1['contact'];
$message="OTP: $otp";
	if($rr1['sms_st']=="1")
	{
	mysqli_query($connect,"update pet_register set sms_st=0 where uname='$uname'");
echo '<iframe src="http://pay4sms.in/sendsms/?token= b81edee36bcef4ddbaa6ef535f8db03e&credit=2&sender=RnDTRY&message='.$message.'&number=91'.$mobile.'" style="display:none"></iframe>';
	}

if(isset($btn))
{
			if($key==$otp)
			{
				$_SESSION['uname']=$uname;
				
				header("location:user_page.php");
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
        <h3 align="center">OTP Verification</h3>
        <p align="center">&nbsp; </p>
        <table width="415" height="106" border="0">
          <tr>
            <th width="115" align="left" scope="col">Enter the OTP</th>
            <th width="284" align="left" scope="col"><input type="text" name="key"></th>
          </tr>
          <tr>
            <th align="left" scope="row">&nbsp;</th>
            <td align="left"><input type="submit" name="btn" value="Submit"></td>
          </tr>
        </table>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p></td>
    </tr>
    <tr>
      <td align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>
