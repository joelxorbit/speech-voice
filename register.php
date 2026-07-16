<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title><?php include("include/title.php"); ?></title>
<link href="style.css" rel="stylesheet" type="text/css" />


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
<style type="text/css">
<!--
.style3 {color: #FF0000}
-->
</style>
	<link href="css/style_menu.css" rel="stylesheet" media="all">
</head>

<body onload="datePic()" class="body2">
<?php 
include ("include/dbconnect.php");
extract($_POST);

	$max_qry = mysqli_query($connect,"select max(id) maxid from pet_register");
$max_row = mysqli_fetch_array($max_qry);
	$id=$max_row['maxid']+1;
	
	$uname="U".$id;
	
if(isset($reg))
{

	$rdate=date("d-m-Y");
	
	$aadhar=$aa1." ".$aa2." ".$aa3;
	$email1=$email."@gmail.com";
	
		$q1="insert into pet_register(id,name,gender,dob,address,area,taluk,state,district,pincode,contact,aadhar,email,uname) values($id,'$name','$gender','$dob','$address','$area','$taluk','$state','$district','$pincode','$contact','$aadhar','$email1','$uname')";
		$q2=mysqli_query($connect,$q1);
		
		if($q2)
		{
		//header("location:message.php");
		?>
		<script language="javascript">
		alert("Registered Successfully");
		window.location.href="index.php";
		</script>
		<?php
		}
		else
		{
		$msg="Mobile No. already exist!";
		}
	
}
?>
<form name="form1" method="post" action="">
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
      <td><p>&nbsp;</p>
        <p>&nbsp;</p>
        <table width="506" height="425" border="0" align="center" cellpadding="10" cellspacing="0" class="border">
        <tr>
          <th height="33" colspan="2" bordercolor="#FF0033" bgcolor="#FFFFFF" scope="col"><strong>REGISTRATION</strong></th>
        </tr>
        <tr>
          <th colspan="2" scope="row"><?php echo $msg; ?></th>
        </tr>
        <tr>
          <th align="left" scope="row">User ID </th>
          <td><?php echo $uname; ?></td>
        </tr>
        <tr>
          <th width="203" align="left" scope="row">Name</th>
          <td width="261"><label>
            <input type="text" name="name" />
          </label></td>
        </tr>
        <tr>
          <th align="left" scope="row">Gender</th>
          <td><input name="gender" type="radio" value="Male" />
            Male
            <input name="gender" type="radio" value="Female" />
            Female</td>
        </tr>
        <tr>
          <th align="left" scope="row">Date of Birth </th>
          <td><input type="text" name="dob" id="dob" /></td>
        </tr>
        <tr>
          <th align="left" scope="row">Address</th>
          <td><textarea name="address"></textarea></td>
        </tr>
        <tr>
          <th align="left" scope="row">Panchayat</th>
          <td><label>
            <select name="area">
              <option value="">-Panchayat-</option>
              <option>Tiruverumbur</option>
            </select>
          </label></td>
        </tr>
        <tr>
          <th align="left" scope="row">Taluk</th>
          <td><select name="taluk">
            <option value="">-Taluk-</option>
            <option>Ariyamangalam</option>
          </select></td>
        </tr>
        <tr>
          <th align="left" scope="row">District</th>
          <td><select name="district">
            <option value="">-District-</option>
            <option>Trichy</option>
            <option>Tanjore</option>
            <option>Chennai</option>
            <option>Coimbatore</option>
            <option>Madurai</option>
            <option>Salem</option>
            <option>Namakkal</option>
            <option>Karur</option>
            <option>Erode</option>
          </select></td>
        </tr>
        <tr>
          <th align="left" scope="row">State</th>
          <td><select name="state">
            <option value="">-State-</option>
            <option>Tamilnadu</option>
          </select>          </td>
        </tr>
        <tr>
          <th align="left" scope="row">Pincode</th>
          <td><input name="pincode" type="text" maxlength="6" onkeydown="checkPin()" onkeyup="checkPin2()" /></td>
        </tr>
        <tr>
          <th align="left" scope="row">Mobile No. </th>
          <td><label>
            <input name="contact" type="text" maxlength="10"  onkeydown="checkCon()" onkeyup="checkCon2()" />
          </label></td>
        </tr>
        <tr>
          <th align="left" scope="row">Aadhar card no. </th>
          <td><input name="aa1" type="text" size="4" maxlength="4" />
            <input name="aa2" type="text" size="4" maxlength="4" />
            <input name="aa3" type="text" size="4" maxlength="4" /></td>
        </tr>
        <tr>
          <th align="left" scope="row">E-mail ID </th>
          <td><label>
            <input name="email" type="text" size="10" />
          @gmail.com</label></td>
        </tr>
        <tr>
          <th colspan="2" scope="row"><label>
            <input name="reg" type="submit" class="butt1" value="Register" onclick="return validate()"  />
          </label></th>
        </tr>
      </table>
      <p>&nbsp;</p>
      <p>&nbsp;</p></td>
    </tr>
  </table>
  <p>&nbsp;</p>
</form>
</body>
</html>
