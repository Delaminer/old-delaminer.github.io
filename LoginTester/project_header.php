<!--<!DOCTYPE html>-->
<html>
<head>
    <meta charset="utf-8">
    <meta name="description" content="Basic description">
    <title>This Website</title>
</head>
<body>
    <header>
        <nav>
            <a href="#">
                Main
            </a>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>More</li>
            </ul>
            <div>
                <form action="includes/login.inc.php" method="post">
                    <input type="text" name="mailuid" placeholder="Username/E-mail...">
                    <input type="password" name="pwd" placeholder="Password...">
                    <button type="submit" name="login-submit">Login</button>
                </form>
                <a href="signup.php">Signup</a>
                <form action="includes/logout.inc.php" method="post">
                    <button type="submit" name="logout-submit">Logout</button>
                </form>
            </div>
        </nav>
    </header>
</body>
</html>