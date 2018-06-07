//
// google analytics
//
// insert following code to track page in scss.tcd.ie
//

//<![CDATA[
	var _gaq = _gaq || [];
	_gaq.push(
		['_setAccount', 'UA-27827357-1'],
		['_setDomainName', 'scss.tcd.ie'],
		['_trackPageview']
	);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
//]]>
