<?php
session_start();
include("include/dbconnect.php");

$msg="";

if(isset($_POST['btn1']))
{
    $mobile = mysqli_real_escape_string($connect,$_POST['mobile']);

    $q4 = mysqli_query($connect,"SELECT * FROM register WHERE contact='$mobile'");

    $n4 = mysqli_num_rows($q4);

    if($n4>0)
    {
        //$otp=rand(1000,9999);
        //mysqli_query($connect,"UPDATE register SET otp='$otp' WHERE contact='$mobile'");
    }
    else
    {
        $msg="Wrong Mobile Number!";
    }
}

if(isset($_POST['login']))
{
    $uname  = mysqli_real_escape_string($connect,$_POST['uname']);
    $mobile = mysqli_real_escape_string($connect,$_POST['mobile']);

    $sql="SELECT * FROM pet_register WHERE contact='$mobile' AND uname='$uname'";

    $result=mysqli_query($connect,$sql);

    if(mysqli_num_rows($result)==1)
    {
        $row=mysqli_fetch_assoc($result);

        $_SESSION['uname']=$row['uname'];

        header("Location: user_page.php");
        exit();
    }
    else
    {
        $msg="Login Incorrect";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<title><?php include("include/title.php"); ?></title>

<meta charset="utf-8">

<style>
.style3{
color:#FFFFFF;
}
</style>

<script>
function validate()
{
    var mobile=document.form1.mobile.value;

    if(mobile=="")
    {
        alert("Enter Mobile Number");
        document.form1.mobile.focus();
        return false;
    }

    if(isNaN(mobile))
    {
        alert("Invalid Mobile Number");
        document.form1.mobile.focus();
        return false;
    }

    if(mobile.length!=10)
    {
        alert("Mobile Number must be 10 digits");
        document.form1.mobile.focus();
        return false;
    }

    return true;
}
</script>

<link href="css/style_menu.css" rel="stylesheet">

</head>

<body class="body2">

<form name="form1" method="post">

<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">

<tr>
<td colspan="2" align="center">
<?php include("include/header.php"); ?>
</td>
</tr>

<tr>
<td colspan="2" align="center" class="subhead">
<?php include("include/link_home.php"); ?>
</td>
</tr>

<tr>

<td align="center" bgcolor="#99CCFF">

<table width="236" border="0" cellpadding="5" cellspacing="0" class="border2">

<tr>
<td align="center">
<span class="txt3"><b>Login</b></span>
</td>
</tr>

<tr>
<td align="center" style="color:red;">
<?php echo $msg; ?>
</td>
</tr>

<tr>
<td>User ID</td>
</tr>

<tr>
<td>
<input type="text" name="uname" required>
</td>
</tr>

<tr>
<td>Mobile No.</td>
</tr>

<tr>
<td>
<input type="text" name="mobile" maxlength="10" required>
</td>
</tr>

<tr>
<td>
<input type="submit" name="login" value="Login" onclick="return validate();">
</td>
</tr>

<tr>
<td align="center">
<a href="register.php">Sign Up</a>
</td>
</tr>

</table>

</td>

</tr>

</table>

</form>

</body>
</html>