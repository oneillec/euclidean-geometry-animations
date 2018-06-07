//
// funcs.js
//
// (C) 2006 - 2018 jones@scss.tcd.ie
//
// 14/07/06 first version
// 11/09/06 added header1()
// 11/09/06 added subcounter parameter to footer()
// 12/09/06 append = to subcounter so that summed count is displayed
// 01/01/07 added lastUpdated()
// 03/01/07 added base parameter to header() function
// 30/10/16 VivioJS
// 27/11/16 used ajax to update and ger counter
//

//
// get file lastModified date
//
let date = new Date(document.lastModified);

//
// header
//
function header(subtitle) {
    d = document;
    d.writeln('<table style="width:96%; margin-left:2%; border:0px">');
    d.writeln('  <tr style="background-color:#000080;">');
    d.writeln('    <td style="font-size:x-large; color:white; padding:5px;">&nbsp; VivioJS - Interactive Reversible E-Learning Animations for the WWW </td>');
    d.writeln('  </tr>');
    d.writeln('  <tr style="height:5px;"></tr>');
    d.writeln('  <tr style="background-color:#c0c0c0;">');
    d.writeln('    <td style="font-variant:small-caps; font-size:large; padding:5px;">&nbsp; ' + subtitle + '</td>');
    d.writeln('  </tr>');
    d.writeln('</table>');
}

//
// lastModified
//
function lastModified() {
	var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  	return date.getDate() + "-" + month[date.getMonth()] + "-" + date.getFullYear() % 100;
}

//
// ajaxCounter
//
function ajaxCounter(counter, subcounter) {
	var url = "https://www.scss.tcd.ie/Jeremy.Jones/counter/hit.php?counter=" + counter + "&subcounter=" + subcounter + "&url=" + document.URL + "&referrer=" + document.referrer + "&options=1";
	var request = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	var td;
	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText) {
				if (td = document.getElementById("count"))
					td.innerHTML = request.responseText;
			}
		}
	}
	request.open("GET", url, true);
	request.send(null);
}

//
// footer
//
function footer(subcounter) {
    d = document;
    d.writeln('<table align=center style="BORDER-COLLAPSE:collapse" cellPadding=5 width="95%" border=0>');
    d.writeln('  <tr style="background-color:#000080; font-size:small;">');
    d.writeln('    <td id="count"; style="width:33%; color:white;"></td>');
    d.writeln('    <td style="width:33%; text-align:center; color:white;">Copyright &copy; ' + date.getFullYear() + ' jones@scss.tcd.ie</td>');
    d.writeln('    <td style="text-align:right; color:white;">last updated: ' + lastModified() + '</td>');
    d.writeln('  </tr>');
    d.writeln('</table>');
	ajaxCounter("vivio", subcounter);
}

// eof