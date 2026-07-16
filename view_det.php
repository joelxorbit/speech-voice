<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_REQUEST);
$uname=$_SESSION['uname'];
$qry=mysqli_query($connect,"select * from pet_apply where id='$id'");
$row=mysqli_fetch_array($qry);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title><?php include("include/title.php"); ?></title>
<link href="style.css" rel="stylesheet" type="text/css" />
<script language="javascript" src="include/menu.js"></script>
<script language="javascript">
function adStatus(adid,uname)
{
window.open("ad_status.php?adid="+adid+"&uname="+uname+"","Send","width=400,height=500,menubar=0,status=0,toolbar=0,scrollbars=1,resizable");
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
  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
    <tr>
      <td align="center"><?php include("include/header.php"); ?></td>
    </tr>
    <tr>
      <td height="25" class="subhead"><?php include("include/link_user.php"); ?></td>
    </tr>
    <tr>
      <td height="407" align="center" valign="top"><p>&nbsp;</p>
        <p>&nbsp;</p>
        <p class="txt3">Status</p>
        <p>&nbsp;</p>
        <table width="442" height="315" border="1" cellpadding="5" cellspacing="0">
          <tr>
            <td width="227">Name</td>
            <td width="233"><?php echo $row['name']; ?></td>
          </tr>
          <tr>
            <td>Area</td>
            <td><?php echo $row['area']; ?></td>
          </tr>
          <tr>
            <td>Taluk</td>
            <td><?php echo $row['taluk']; ?></td>
          </tr>
          <tr>
            <td>District</td>
            <td><?php echo $row['district']; ?></td>
          </tr>
          <tr>
            <td>State</td>
            <td><?php echo $row['state']; ?></td>
          </tr>
          <tr>
            <td>Pincode</td>
            <td><?php echo $row['pincode']; ?></td>
          </tr>
          <tr>
            <td>Aadhar Card No. </td>
            <td><?php echo $row['aadhar']; ?></td>
          </tr>
          <tr>
            <td>Mobile No. </td>
            <td><?php echo $row['contact']; ?></td>
          </tr>
          <tr>
            <td>E-mail</td>
            <td><?php echo $row['email']; ?></td>
          </tr>
          <tr>
            <td>Apply Date </td>
            <td><?php echo $row['rdate']; ?></td>
          </tr>
          <tr>
            <td>Complaint</td>
            <td><?php echo $row['complaint']; ?></td>
          </tr>
          <tr>
            <td>Status</td>
            <td><?php
			if($row['status']=="2")
			{
			echo "Process Completed";
			}
			else if($row['status']=="1")
			{
			echo "Process ".$row['process'];
			}
			else
			{
			echo "Petition Sent..";
			}
			
			?></td>
          </tr>
        </table>
        <p>&nbsp; </p>
      <p align="center">&nbsp;</p>        <p>&nbsp;</p></td>
    </tr>
    <tr>
      <td height="25" align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>
