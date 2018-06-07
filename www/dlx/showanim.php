<!-- 06/07/06 updated for Vivio 4.0 -->
<!-- 13/09/06 further updates for Vivio 4.0 -->
<!-- 20/10/16 VivioJS -->
<!-- 22/11/16 hardened by calling htmlspecialchars on description text -->

<?php include( "setup.php" );

if (isset($_REQUEST["name"])) {


	$query = mysql_query( "SELECT `id`, `description`, `state`, `locked` FROM `MIPS programs` WHERE `name` = '" . mysql_escape_string($_REQUEST["name"]) . "'" )
		or die( "MySQL problem: " . mysql_error() );

	$rows = mysql_num_rows( $query );
	if ($rows > 1) {
		die( "More than one program found. Aborting." );
	} elseif( $rows == 1 ){
		$arr = mysql_fetch_array( $query );
	}

?>

	<html>

	<head>
		<title>Vivio DLX/MIPS animation</title>
		<script src="../analytics.js"></script>
		<script src="../funcs.js"></script>
		<script src="../vivio.js"></script>
		<script src="dlx.js"></script>
	</head>

	<body scroll="no" leftmargin=0 rightmargin=0 topmargin=0 bottommargin=0>

	<!-- tabindex needed for keyboard input -->
	<canvas id="canvas" tabindex="1" style="width:100%; height:100%; position:absolute; overflow:hidden; display:block;">
		No canvas support
	</canvas>

	<script>
		// need to remove quotes around numbers
		args = "<?=$arr["state"] . " locked='" . $arr["locked"] . "'"?>";
		args = args.replace(/'/g, "") + " help=0";
		args = "<?="name='" . $_REQUEST["name"] . "' "?>" + args;
		vplayer = new VPlayer("canvas", dlx, args);
		ajaxCounter("vivio", "dlx");
	</script>

	</body>
	</html>

<?php

	// update count
	mysql_query( "UPDATE `MIPS programs` SET `count` = `count` + 1 WHERE `id` = '" . mysql_escape_string($arr["id"]) . "'" );

} else {

?>

	<html>
	<head>
		<title>VivioJS DLX/MIPS animation</title>
		<link rel="stylesheet" type="text/css" href="vivio.css">
		<script src="../analytics.js"></script>
		<script src="../funcs.js"></script>
	</head>

	<body>

		<script>
			header1("Vivio DLX/MIPS Saved Examples");
		</script>

		<BR>

		<table width="95%" align="center" cellspacing="0" cellpadding="5">
		<tr></tr>
<?php

		$query = mysql_query( "SELECT `name`, `description`, `username`, `count` FROM `MIPS programs` ORDER BY `username`, `name`" );

		if( mysql_num_rows( $query ) == 0 ) {

			echo( "Sorry, no programs found" );

		} else {

			echo( "<tr>" );
			echo( "<td></td>" );
			echo( "<td class=\"bd\" width=\"15%\"><b>Submitter</b></td>" );
			echo( "<td class=\"bd\" width=\"15%\"><b>Configuration</b></td>" );
			echo( "<td class=\"bd\"><b>Visits</b></td>" );
			echo( "<td class=\"bd\"><b>Description</b></td>" );
			echo( "</tr>" );
			while( $arr = mysql_fetch_array( $query ) ) {
				echo( "<tr>\n" );
				echo( "<td><a href=\"delanim.php?name=" . $arr["name"] . "\" title=\"Delete\"><img style=\"margin: 0pt;\" src=\"trash.gif\" border=\"0\"></a></td>" );
				echo( "<td class=\"blrd\">" . $arr["username"] . "</td>\n" );
				echo( "<td class=\"brd\" align=\"center\"><a href=\"" . $_SERVER["PHP_SELF"] . "?name=" . $arr["name"] . "\" title=\"Run animation\">" . $arr["name"] . "</a></td>" );
				echo( "<td class=\"brd\" align=\"center\">" . $arr["count"] . "</td>" );
				echo( "<td class=\"brd\"><i>" . htmlspecialchars($arr["description"]) . "&nbsp;</i></td>" );	// {joj 22/11/16}
				echo( "</tr>\n" );
			}

		}
?>
		</tr>
		</td>
		</table>

<br>

<script>
  footer("dlx");
</script>

</body>
</html>

<?php
}
?>
