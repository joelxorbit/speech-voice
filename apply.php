<?php
include("include/protect.php");
include("include/dbconnect.php");
extract($_REQUEST);
$uname=$_SESSION['uname'];
if($dept=="")
{
$dept="Road";
}

$qry=mysqli_query($connect,"select * from pet_register where uname='$uname'");
$row=mysqli_fetch_array($qry);


if(isset($btn))
{
$max_qry = mysqli_query($connect,"select max(id) maxid from pet_apply");
$max_row = mysqli_fetch_array($max_qry);
	$id=$max_row['maxid']+1;
	$rdate=date("d-m-Y");
	
$aadhar=$aa1." ".$aa2." ".$aa3;
	$email1=$email."@gmail.com";
	
		$q1="insert into pet_apply(id,gender,dob,address,uname,name,area,taluk,state,district,pincode,contact,aadhar,email,dept,complaint,ptype,status,rdate) values($id,'$gender','$dob','$address','$uname','$name','$area','$taluk','$state','$district','$pincode','$contact','$aadhar','$email1','$dept','$complaint','$ptype','0','$rdate')";
		$q2=mysqli_query($connect,$q1);
		
		if($q2)
		{
		?>
		<script language="javascript">
		alert("Applied Successfully");
		window.location.href="status.php";
		</script>
		<?php
		}
		else
		{
		$msg="Could not Registered";
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


<link rel="stylesheet" href="date_picker/jquery-ui.css">
<script src="date_picker/jquery-1.12.4.js"></script>
  <script src="date_picker/jquery-ui.js"></script>
  <script>
  $( function() {
    $( "#dob" ).datepicker();
  } );
  
  
  </script>
<script language="javascript">
function validate()
{
if(document.form1.name.value=="")
	{
	alert("Enter the Name");
	document.form1.name.focus();
	return false;
	}
	if(document.form1.gender[0].checked==false && document.form1.gender[1].checked==false) 
	{
	alert("Select the Gender");
	return false;
	}
	if(document.form1.dob.value=="")
	{
	alert("Enter the Date of Birth");
	document.form1.dob.focus();
	return false;
	}
	if(document.form1.address.value=="")
	{
	alert("Enter the Address");
	document.form1.address.focus();
	return false;
	}
	if(document.form1.area.selectedIndex==0)
	{
	alert("Enter the Panchayat");
	document.form1.area.focus();
	return false;
	}
	if(document.form1.taluk.value=="")
	{
	alert("Enter the Taluk");
	document.form1.taluk.focus();
	return false;
	}
	if(document.form1.district.selectedIndex==0)
	{
	alert("Select the District");
	document.form1.district.focus();
	return false;
	}
	if(document.form1.state.selectedIndex==0)
	{
	alert("Select the State");
	document.form1.state.focus();
	return false;
	}
	if(document.form1.pincode.value=="")
	{
	alert("Enter the Pincode");
	document.form1.pincode.focus();
	return false;
	}
	if(document.form1.contact.value=="")
	{
	alert("Enter the Mobile Number");
	document.form1.contact.focus();
	return false;
	}
	if(isNaN(document.form1.contact.value))
	{
	alert("Invaalid Mobile Number!");
	document.form1.contact.select();
	return false;
	}
	if(document.form1.contact.value.length!=10)
	{
	alert("Mobile Number must be 10 digits");
	document.form1.contact.select();
	return false;
	}
	if(document.form1.aa1.value.length!=4 || document.form1.aa2.value.length!=4 || document.form1.aa3.value.length!=4)
	{
	alert("Aadhar No. is Incorrect!");
	document.form1.aa1.focus();
	return false;
	}
	if(document.form1.email.value=="")
	{
	alert("Enter the E-mail");
	document.form1.email.focus();
	return false;
	}
	if(document.form1.complaint.value=="")
	{
	alert("Enter the Complaint");
	document.form1.complaint.focus();
	return false;
	}
	
return true;
}

function checkPin()
{
	if(isNaN(document.form1.pincode.value))
	{
	document.form1.pincode.value="";
	}
}
function checkPin2()
{
	if(isNaN(document.form1.pincode.value))
	{
	document.form1.pincode.value="";
	}
}
function checkCon()
{
	if(isNaN(document.form1.contact.value))
	{
	document.form1.contact.value="";
	}
}
function checkCon2()
{
	if(isNaN(document.form1.contact.value))
	{
	document.form1.contact.value="";
	}
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
        <p class="txt3"> Apply Petition </p>
        <p class="txt3">&nbsp;</p>
        <p><a href="apply.php?dept=Road">Road</a>&nbsp;&nbsp;&nbsp;
		<a href="apply.php?dept=Water">Water</a>&nbsp;&nbsp;&nbsp;&nbsp;
		<a href="apply.php?dept=Electricity">Electricity</a>&nbsp;&nbsp;&nbsp;
		<a href="apply.php?dept=Health-Care">Health-Care</a></p>
        <p>&nbsp; </p>
      <p align="center">Department: <?php echo $dept; ?></p>
      <p align="center">&nbsp;</p>
      <table width="481" height="232" border="0" cellpadding="5" class="border">
        <tr class="border">
          <th width="161" align="left" scope="row">Name</th>
          <td width="288"><label>
            <input type="text" name="name" value="<?php echo $row['name']; ?>" />
          </label></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Gender</th>
          <td><input name="gender" type="radio" value="Male" <?php if($row['gender']=="Male") echo "checked"; ?> /> 
            Male 
            <input name="gender" type="radio" value="Female" <?php if($row['gender']=="Female") echo "checked"; ?> />
            Female</td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Date of Birth </th>
          <td><input type="text" name="dob" id="dob" value="<?php echo $row['dob']; ?>" /></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Address</th>
          <td><textarea name="address"><?php echo $row['address']; ?></textarea></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Panchayat</th>
          <td><label>
            <select name="area">
              <option value="">-Panchayat-</option>
              <option <?php if($row['area']=="Tiruverumbur") echo "selected"; ?>>Tiruverumbur</option>
            </select>
          </label></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Taluk</th>
          <td><select name="taluk">
              <option value="">-Taluk-</option>
              <option <?php if($row['taluk']=="Ariyamangalam") echo "selected"; ?>>Ariyamangalam</option>
            </select></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">District</th>
          <td><select name="district">
              <option value="">-District-</option>
              <option <?php if($row['district']=="Trichy") echo "selected"; ?>>Trichy</option>
              <option <?php if($row['district']=="Tanjore") echo "selected"; ?>>Tanjore</option>
              <option <?php if($row['district']=="Chennai") echo "selected"; ?>>Chennai</option>
              <option <?php if($row['district']=="Coimbatore") echo "selected"; ?>>Coimbatore</option>
              <option <?php if($row['district']=="Madurai") echo "selected"; ?>>Madurai</option>
              <option <?php if($row['district']=="Salem") echo "selected"; ?>>Salem</option>
              <option <?php if($row['district']=="Namakkal") echo "selected"; ?>>Namakkal</option>
              <option <?php if($row['district']=="Karur") echo "selected"; ?>>Karur</option>
              <option <?php if($row['district']=="Erode") echo "selected"; ?>>Erode</option>
          </select></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">State</th>
          <td><select name="state">
              <option value="">-State-</option>
              <option <?php if($row['state']=="Tamilnadu") echo "selected"; ?>>Tamilnadu</option>
            </select>          </td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Pincode</th>
          <td><input name="pincode" type="text" value="<?php echo $row['pincode']; ?>" maxlength="6" onKeyDown="checkPin()" onKeyUp="checkPin2()" /></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Mobile No. </th>
          <td><label>
            <input name="contact" type="text" value="<?php echo $row['contact']; ?>" maxlength="10"  onkeydown="checkCon()" onKeyUp="checkCon2()" />
          </label></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Aadhar card no. </th>
		  <?php $adh=explode(" ",$row['aadhar']); ?>
          <td><input name="aa1" type="text" size="4" value="<?php echo $adh[0]; ?>" />
              <input name="aa2" type="text" size="4" value="<?php echo $adh[1]; ?>" />
              <input name="aa3" type="text" size="4" value="<?php echo $adh[2]; ?>" /></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">E-mail ID </th>
          <td><label>
		  <?php $ema=explode("@",$row['email']); ?>
            <input name="email" type="text" size="10" value="<?php echo $ema[0]; ?>" />
            @gmail.com</label></td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Petition Type </th>
          <td><select name="ptype">
		  <option>New Petition</option>
		  <option>Repeated Petition</option>
          </select>
          </td>
        </tr>
        <tr class="border">
          <th align="left" scope="row">Complaint</th>
          <td><textarea name="complaint" cols="40" rows="4"><?php echo $row['complaint'] ?? ''; ?></textarea></td>
        </tr>
        <tr>
          <th align="left" scope="row">&nbsp;</th>
          <td align="left"><input type="submit" name="btn" value="Submit" onClick="return validate()" /></td>
        </tr>
      </table>      
      <p>&nbsp;</p></td>
    </tr>
    <tr>
      <td height="25" align="center" class="subhead">&nbsp;</td>
    </tr>
  </table>
</form>
</body>
</html>
