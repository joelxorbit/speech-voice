<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_POST);

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title><?php include("include/title.php"); ?></title>
<link href="style.css" rel="stylesheet" type="text/css">
<script language="javascript" src="include/menu.js"></script>
	<link href="css/style_menu.css" rel="stylesheet" media="all">
</head>

<body class="body2"><form action="" method="post" enctype="multipart/form-data" name="form1" id="form1">
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
      <td height="25" class="subhead"><?php include("include/link_admin.php"); ?></td>
    </tr>
    <tr>
      <td align="center" valign="top"><p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <h2>Welcome Admin </h2>
        <p>&nbsp;</p>
        <h3>Petition Details </h3>
        <p>&nbsp;</p>
        <p>
          <?php
		$q1=mysqli_query($connect,"select * from pet_apply where status<2 order by id desc");
		$n1=mysqli_num_rows($q1);
		if($n1>0)
		{
		?>
</p>
        <table width="740" border="1">
          <tr>
            <th width="48" scope="col">Sno</th>
            <th width="167" scope="col">Petition ID </th>
            <th width="195" scope="col">Department</th>
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
            <td><?php echo $r1['rdate']; ?></td>
            <td><a href="view_det3.php?id=<?php echo $r1['id']; ?>">View</a></td>
          </tr>
          <?php
		  }
		  ?>
        </table>
        <?php
		}
		 ?>
<p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p></td>
    </tr>
    <tr>
      <td height="25" align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>

</body>
</html>
