<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_REQUEST);
$uname=$_SESSION['uname'];
$qry=mysqli_query($connect,"select * from pet_register where uname='$uname'");
$row=mysqli_fetch_array($qry);

if($act=="ok")
{
$mobile=$row['contact'];
$otp=rand(1000,9999);
mysqli_query($connect,"update pet_register set otp='$otp' where uname='$uname'");

$message="OTP: $otp";
echo '<iframe src="http://pay4sms.in/sendsms/?token= b81edee36bcef4ddbaa6ef535f8db03e&credit=2&sender=RnDTRY&message='.$message.'&number=91'.$mobile.'" style="display:none"></iframe>';

?>
<script>
//Using setTimeout to execute a function after 5 seconds.
setTimeout(function () {
//   //Redirect with JavaScript
   window.location.href= 'check_otp.php?id=<?php echo $id; ?>';
}, 2000);
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
        <p align="center">&nbsp;</p>  
		<?php
		$q1=mysqli_query($connect,"select * from pet_apply where uname='$uname' order by id desc");
		$n1=mysqli_num_rows($q1);
		if($n1>0)
		{
		?>      
        <table width="899" border="1">
          <tr>
            <th width="48" scope="col">Sno</th>
            <th width="167" scope="col">Petition ID </th>
            <th width="195" scope="col">Department</th>
            <th width="148" scope="col">State</th>
            <th width="148" scope="col">District</th>
            <th width="148" scope="col">Taluk</th>
            <th width="148" scope="col">Panchayat</th>
            <th width="148" scope="col">Pincode</th>
            <th width="148" scope="col">Complaint</th>
            <th width="148" scope="col">Date</th>
            <th width="148" scope="col">View Status </th>
          </tr>
		  <?php
		  $i=0;
		  while($r1=mysqli_fetch_array($q1))
		  {
		  $i++;
		  ?>
          <tr>
            <th scope="row"><?php echo $i; ?></th>
            <td><?php echo $r1['id']; ?></td>
            <td><?php echo $r1['dept']; ?></td>
            <td><?php echo $r1['state']; ?></td>
            <td><?php echo $r1['district']; ?></td>
            <td><?php echo $r1['taluk']; ?></td>
            <td><?php echo $r1['area']; ?></td>
            <td><?php echo $r1['pincode']; ?></td>
            <td><?php echo $r1['complaint']; ?></td>
            <td><?php echo $r1['rdate']; ?></td>
            <td>
			<?php
			if($r1['status']=="2")
			{
			echo "Process Completed";
			}
			else if($r1['status']=="1")
			{
			echo "Process ".$r1['process'];
			}
			else
			{
			echo "Petition Sent..";
			}
			?>
			
			<br /><a href="status.php?act=ok&id=<?php echo $r1['id']; ?>">View</a></td>
          </tr>
		  <?php
		  }
		  ?>
        </table>
		<?php
		}
		 ?>   
			    <p>&nbsp;</p></td>
    </tr>
    <tr>
      <td height="25" align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>
