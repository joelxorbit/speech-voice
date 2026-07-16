<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_POST);

$q11=mysqli_query($connect,"select * from pet_apply where status>0");
		$n11=mysqli_num_rows($q11);
		
		$q1=mysqli_query($connect,"select * from pet_apply where process='Completed'");
		$n1=mysqli_num_rows($q1);
		$q2=mysqli_query($connect,"select * from pet_apply where process='Pending'");
		$n2=mysqli_num_rows($q2);
		$q3=mysqli_query($connect,"select * from pet_apply where process='Rejected'");
		$n3=mysqli_num_rows($q3);
		
		
		if($n1>0)
		{
		$a=($n1/$n11)*100;
		}
		else
		{
		$a=0;
		}
		
		if($n2>0)
		{
		$b=($n2/$n11)*100;
		}
		else
		{
		$b=0;
		}
		
		
		if($n3>0)
		{
		$c=($n3/$n11)*100;
		}
		else
		{
		$c=0;
		}
		
		
		
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title><?php include("include/title.php"); ?></title>
<link href="style.css" rel="stylesheet" type="text/css">
<script language="javascript" src="include/menu.js"></script>
<script>
window.onload = function() {

var chart = new CanvasJS.Chart("chartContainer", {
	animationEnabled: true,
	title: {
		text: ""
	},
	data: [{
		type: "pie",
		startAngle: 240,
		yValueFormatString: "##0.00'%'",
		indexLabel: "{label} {y}",
		dataPoints: [
			{y: <?php echo $a; ?>, label: "Completed"},
			{y: <?php echo $b; ?>, label: "Pending"},
			{y: <?php echo $c; ?>, label: "Rejected"}
		]
	}]
});
chart.render();

}
</script>
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
        <h2>Statistical Survey        </h2>
        <p>&nbsp;</p>
        <p>
		<?php
		
		
		echo "<h3>Completed: $a%, Pending: $b%, Rejected: $c%</h3>";
		?>
		</p>
		<div id="chartContainer" style="height: 370px; max-width: 920px; margin: 0px auto;"></div>
<script src="js/canvasjs.min.js"></script>
        <p>&nbsp;</p>
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
