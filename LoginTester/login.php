<!DOCTYPE html>
<html lang="en">
<head>
  <title>Alex's Alcove</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<?php
echo "Starting PHP...";
$username = $password = "";
$valid = true;
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["username"])) {
    $username = "";
    $valid = false;
  } else {
    $username = test_input($_POST["username"]);
  }
  if (empty($_POST["password"])) {
    $password = "";
    $valid = false;
  } else {
    $password = test_input($_POST["password"]);
  }
}
else {
  $valid = false;
}

if ($valid) {
  echo "Welcome, " . $username . "!";
  echo "<br><form action=\"";
  //echo htmlspecialchars($_SERVER["PHP_SELF"]);
  echo "\" method=\"POST\"><input type=\"submit\" name=\"\" value=\"Logout\"></form>";
}
else {
  echo "
  <h1>Welcome!</h1>
  Please login:
  <form action=\"";
  //echo htmlspecialchars($_SERVER["PHP_SELF"]);
  echo "\" method=\"POST\">
      <p>Username</p>
      <input type=\"text\" name=\"username\" placeholder=\"Enter Username\">
      <p>Password</p>
      <input type=\"password\" name=\"password\" placeholder=\"Enter Password\">
      <input type=\"submit\" name=\"\" value=\"Login\">
  </form>\n
  ";
  
  // echo "<h2>Your Input:</h2>";
  // echo "<br>Start:";
  // echo $username;
  // echo ",";
  // echo $password;
  // echo "End.";
}
function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>
<!--
<h1>Welcome!</h1>
Please login:
<form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>" method="POST">
    <p>Username</p>
    <input type="text" name="username" placeholder="Enter Username">
    <p>Password</p>
    <input type="password" name="password" placeholder="Enter Password">
    <input type="submit" name="" value="Login">
</form>
-->
</body>
</html>
