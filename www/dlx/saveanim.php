<!-- 20/10/16 VivioJS -->
<!-- 27/11/16 hardened with calls to htmlspecialchars -->

<?php include( "setup.php" ); ?>
<html>

	<head>
		<title>DLX save configuration</title>
		<link rel="stylesheet" type="text/css" href="vivio.css">
		<script src="../analytics.js"></script>
		<script language="javascript">
			function getDetails(name) {
				url = "<?=$_SERVER["PHP_SELF"]?>?replace=" + name + "&state=<?=stripslashes($_REQUEST["state"])?>";
				window.location = url;
			}
		</script>
		<script src="../funcs.js"></script>
	</head>

	<body>
		<script>
			header("Vivio Save DLX/MIPS Configuration");
			</script>
			<BR>

		<table width="90%" align="center"><tr><td>
			<h1>Save Animation</h1>

<?php
	if( strcmp( $_REQUEST["submit"], "Save" ) || !strcmp( $_REQUEST["saveas"], "" ) || !strcmp( $_REQUEST["username"], "" ) ) {
?>
			<p>
			To save your animation (program), enter a name and a description for the animation. If you
			want to "lock" the animation (make sure people cannot change the circuit configuration or
			change the contents of the instruction memory when they are running your program), tick the
			"Locked" option.
			</p>

			<p>
			Then enter a username and a password to protect your program. If there is any program in
			the database with the username you selected, your password must match the password for that
			program. In other words, as soon as you save a program with username "John" and password
			"Doe", any other program saved with the username "John" must have the password "Doe". This
			means that people cannot save programs under your name.
			</p>

			<form method="add" action="<?=$_SERVER["PHP_SELF"]?>">
			<input type="hidden" name="state" value="<?=stripslashes($_REQUEST["state"])?>">
			<table>
<?php
	$query = mysql_query( "SELECT * FROM `MIPS programs` ORDER BY `name`" );

	if( mysql_num_rows( $query ) > 0 ) {

		echo( "<tr><td>Replace</td><td><select name=\"replace\" onchange=\"javascript:getDetails(value);\">\n" );

		while( $arr = mysql_fetch_array( $query ) ) {
			if( strcmp( $_REQUEST["replace"], $arr["name"] ) ) {
				echo( "<option value=\"" . $arr["name"] . "\">" . $arr["name"] . "</option>\n" );
			} else {
				echo( "<option selected value=\"" . $arr["name"] . "\">" . $arr["name"] . "</option>\n" );

				$foundSelected = true;

				$name = htmlspecialchars($arr["name"]);	// {joj 21/11/16}
				$description = htmlspecialchars($arr["description"]);	// {joj 21/11/16}
				$locked = $arr["locked"] ? "checked" : "";
				$username = htmlspecialchars($arr["username"]);	// {joj 21/11/16}
			}
		}

		if( !$foundSelected )
			echo( "<option value=\"\" selected>(None)</option>\n" );
		else
			echo( "<option value=\"\">(None)</option>\n" );

		echo( "</select></td></tr>\n" );
	}
?>
			<tr>
				<td>Save As</td>
				<td><input type="text" name="saveas" value="<?=$name?>"></td>
			</tr>
			<tr>
				<td>Description</td>
				<td><textarea cols="50" rows="6" name="description"><?=$description?></textarea></td>
			</tr>
			<tr>
				<td>Lock circuit setup</td>
				<td><input type="checkbox" name="locked" value="checked" <?=$locked?>></td>
			</tr>
			<tr>
				<td>Username</td>
				<td><input type="text" name="username" value="<?=$username?>"></td>
			</tr>
			<tr>
				<td>Password</td>
				<td><input type="password" name="password"></td>
			</tr>
			<tr>
				<td colspan="2" align="right">
					<input type="submit" value="Save" name="submit">
				</td>
			</tr>
			</table>
			</form>
<?php } else {

	// Check the password
	$query = mysql_query( "SELECT `password` FROM `MIPS programs` WHERE `username` = '" . mysql_escape_string($_REQUEST["username"]) . "' LIMIT 1" );
	if( mysql_num_rows( $query ) == 1 )
	{
		$arr = mysql_fetch_array( $query );

		if( strcmp( $arr["password"], md5( $_REQUEST["password"] ) ) )
			echo( "Sorry, invalid password" );
		else
			$ok = True;
	}
	else
		$ok = True;

	// Replace existing program if so required, and if owned by current user
	if( $ok && strcmp( $_REQUEST["replace"], "" ) )
	{
		$query = mysql_query( "SELECT `username`, `count` FROM `MIPS programs` WHERE `name` = '" . mysql_escape_string($_REQUEST["replace"]) . "'" )
			or die( "MySQL problem: " . mysql_error() );

		if( mysql_num_rows( $query ) < 1 )
			die( "Illegal option for \"replace\". Aborting." );
		if( mysql_num_rows( $query ) > 1 )
			die( "Multiple programs with the same name found. Aborting." );

		$arr = mysql_fetch_array( $query );

		if( strcmp( $arr["username"], $_REQUEST["username"] ) )
		{
			echo( "Sorry, you do not appear to own the program <b>" . $_REQUEST["replace"] . "</b>" );
			$ok = False;
		}

		if( $ok )
		{
			$count = $arr["count"];
			mysql_query( "DELETE FROM `MIPS programs` WHERE `name` = '" . mysql_escape_string($_REQUEST["replace"]) . "'" );
		}
	}
	else
		$count = 0;

	// And finally save the new program (if it doesn't exist yet)
	if( $ok )
	{
		$query = mysql_query( "SELECT * FROM `MIPS programs` WHERE `name` = '" . mysql_escape_string($_REQUEST["saveas"]) . "'" )
			or die( "MySQL problem: " . mysql_error() );

		if( mysql_num_rows( $query ) == 0 )
		{
			$locked = $_REQUEST["locked"] == "checked" ? "1" : "0";

			printf("Test<br>");

			$query =
				"INSERT "
				.	"INTO `MIPS programs` "
				.	"("
					.	"`id`, "
					.	"`name`, "
					.	"`description`, "
					.	"`locked`, "
					.	"`username`, "
					.	"`password`, "
					.	"`state`, "
					.	"`count`"
				.	")"
				.	"VALUES "
				.	"("
					.	"NULL, "
					.	"'" . mysql_escape_string($_REQUEST["saveas"]) . "', "
					.	"'" . mysql_escape_string($_REQUEST["description"]) . "', "
					.	"'$locked', "
					.	"'" . mysql_escape_string($_REQUEST["username"]) . "', "
					.	"MD5('" . mysql_escape_string($_REQUEST["password"]) . "'), "
					.	"'" . mysql_escape_string($_REQUEST["state"]) . "', "
					.	"'" . mysql_escape_string($count) . "'"
				.	")";

			mysql_query($query)
				or die( "Could not save program: " . mysql_error() );

			echo( "Animation " );
			echo( "<a href=\"showanim.php?name=" . $_REQUEST["saveas"] . "\">" . $_REQUEST["saveas"] . "</a> " );
			echo( "has been saved. (Show program <a href=\"showanim.php\">overview</a>)" );
		} else {
			echo( "Sorry, a program with that name already exists. Use the \"Replace\" option to overwrite existing programs." );
		}
	}
} ?>

		</td>
		</tr>
		</table>
		<BR>

	</body>

</html>
