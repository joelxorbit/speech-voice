<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_REQUEST);
$uname=$_SESSION['uname'];
$qry=mysqli_query($connect,"select * from pet_register where uname='$uname'");
$row=mysqli_fetch_array($qry);
$otp=$row['otp'];
if(isset($btn))
{
	if($otp==$key)
	{
	?>
		<script language="javascript">
		window.location.href="view_det.php?id=<?php echo $id; ?>";
		</script>
		<?php
	
	}
	else
	{
	?>
		<script language="javascript">
		alert("OTP is wrong!");
		</script>
		<?php
	}

}
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
        <p class="txt3">OTP Verification</p>
        <p>&nbsp;</p>
        <table width="422" height="133" border="0" class="border">
          <tr>
            <th width="202" align="left" scope="col">Enter the OTP </th>
            <th width="204" align="left" scope="col"><input type="text" name="key" /></th>
          </tr>
          <tr>
            <th align="left" scope="row">&nbsp;</th>
            <td align="left"><input type="submit" name="btn" value="Submit" /></td>
          </tr>
        </table>        
        <p>&nbsp;</p>      </td>
    </tr>
    <tr>
      <td height="25" align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>
