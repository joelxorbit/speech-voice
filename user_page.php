<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_POST);
$uname=$_SESSION['uname'];

if(isset($btn2))
{
?>
<script language="javascript">
window.location.href="apply.php";
</script>
<?php
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
        <p class="txt3">Welcome to Petition Application</p>
        <p class="txt3">&nbsp;</p>
        <p>Enter the User ID 
          <span class="txt3">
          <input type="text" name="userid" />
          <input type="submit" name="btn" value="Submit" />
          </span></p>
        <p class="txt3">&nbsp; </p>
        <p>&nbsp;</p>
		<?php
		if(isset($btn))
		{
		$qry=mysqli_query($connect,"select * from pet_register where uname='$userid'");
		$num=mysqli_num_rows($qry);
			if($num>0)
			{
		$row=mysqli_fetch_array($qry);
	
		?>
        <p class="txt2">User Information </p>
        <p>&nbsp;</p>
        <table width="466" height="315" border="1" cellpadding="5" cellspacing="0">
          <tr>
            <td width="225">Name</td>
            <td width="198"><?php echo $row['name']; ?></td>
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
        </table>
			
			<p>
			  <input type="submit" name="btn2" value="Apply Petition" />			  
	          </p>
			    <?php
			}
			else
			{
			echo "<h3 align=center>User ID is wrong!</h3>";
			}
			
			}
			
			?>
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
