<?php
session_start();
include("include/dbconnect.php");
extract($_POST);
$msg="";

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
      <td height="25" align="center" class="subhead"><?php include("include/link_off.php"); ?></td>
    </tr>
    <tr>
      <td align="center" valign="top"><p>&nbsp;</p>
        <p>&nbsp;</p>
        <p align="center">&nbsp;</p>
        <h2>Welcome Officer</h2>
        <p>&nbsp;</p>
        <h3>Petition Details         </h3>
        <p>&nbsp;</p>
        <p>
          <?php
		$q1=mysqli_query($connect,"select * from pet_apply where status=1 order by id desc");
		$n1=mysqli_num_rows($q1);
		if($n1>0)
		{
		?>
</p>
        <table width="883" border="1">
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
            <td><a href="view_det2.php?id=<?php echo $r1['id']; ?>">View</a></td>
          </tr>
          <?php
		  }
		  ?>
        </table>
        <?php
		}
		 ?>
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
