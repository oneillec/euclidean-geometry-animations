<!-- 20/10/16	VivioJS -->

<?php include( "setup.php" ); ?>

<html>

	<head>
		<title>Stalls in the MIPS pipeline</title>
		<link rel="stylesheet" type="text/css" href="vivio.css">
		<script src="../analytics.js"></script>
		<script src="../funcs.js"></script>
	</head>

	<body>
		<script>
			header("Vivio DLX/MIPS Delete DLX Configuration");
		</script>
		<BR>

		<table width="90%" align="center"><tr><td>
<?php
	if (!strcmp($_REQUEST["password"], "" )) {
?>
			<h1>Delete animation "<?=htmlspecialchars($_REQUEST["name"])?>"</h1>

			<p>
			Please enter your password to continue.
			</p>

			<form method="post" action="<?=$_SERVER["PHP_SELF"]?>">
				<input type="hidden" name="name" value="<?=htmlspecialchars($_REQUEST["name"])?>">
				<input type="password" name="password">
				<input type="submit" value="OK"> <br>
				<input type="radio" name="mode" value="delete" checked>Delete program <br>
				<input type="radio" name="mode" value="reset">Reset counter <br>
			</form>
<?php
	} else {

		$query = mysql_query( "SELECT `password` FROM `MIPS programs` WHERE `name` = '" . mysql_escape_string(htmlspecialchars($_REQUEST["name"])) . "'" );

		$n = mysql_num_rows($query);

		//if( $n > 1 )
		//	die( "$n programs with the same name found. Aborting." );

		if ($n < 1) {
			echo('Configuration "' . htmlspecialchars($_REQUEST["name"]) . '" NOT found (check for unusual characters in configuration name).');
		} else {
			$arr = mysql_fetch_array($query);
			if (!strcmp($arr["password"], md5( $_REQUEST["password"])) || !strcmp( $master, $_REQUEST["password"])) {
				if (!strcmp( $_REQUEST["mode"], "delete" )) {
					mysql_query( "DELETE FROM `MIPS programs` WHERE `name` = '" . mysql_escape_string($_REQUEST["name"]) . "'" );
					echo( "Program <b>" . $_REQUEST["name"] . "</b> deleted (<a href=\"showanim.php\">back saved dlx configuration list</a>)." );
				} elseif (!strcmp( $_REQUEST["mode"], "reset")) {
					mysql_query( "UPDATE `MIPS programs` SET `count` = 0 WHERE `name` = '" . mysql_escape_string($_REQUEST["name"]) . "'" );
					echo( "Counter reset for program <b>" . $_REQUEST["name"] . "</b> (<a href=\"showanim.php\">Back saved dlx configuration list</a>)." );
				} else {
					die( "Invalid operation");
				}
			} else {
				echo( "Invalid password" );
			}
		}
	}
?>
		</td>
		</tr>
		</table>
		<BR>

		<script>
		  footer("dlx");
		</script>

	</body>

</html>
