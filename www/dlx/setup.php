<?php

	// Mysql configuration

	$host = "macneill";
	$user = "jones";
	$pass = "Vivio303";
	$database = "jones_db";

	$master = "Avsp303";

	// CREATE TABLE `MIPS programs` (
	//		`id` INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
	//		`name` TEXT,
	//		`description` TEXT,
	//		`locked` BOOL,
	//		`username` TEXT,
	//		`password` TEXT,
	//		`state` TEXT
	//		`count` INTEGER
	// )

	$link = mysql_connect( $host, $user, $pass )
		or die( "Could not connect: " . mysql_error() );

	mysql_select_db( $database )
		or die( "Could not select database: " . mysql_error() );

?>
