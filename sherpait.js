if (typeof jQuery == 'undefined') {
	var jQ = document.createElement('script');
	jQ.type = 'text/javascript';
	jQ.onload=runthis;
	jQ.src = 'http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js';
	document.body.appendChild(jQ);
} else {
	runthis();
}

function runthis() {
	$('<div/>', {
			'id': 'waiting',
			html: '<div id="loading"><p><img src="http://demonstrators.ostephens.com/sherpa-it/ajax-loader.gif" /><br />Sherpa-It is checking Sherpa/Romeo for information, please wait</p>'
	}).insertAfter('div.page-header');
	$('<div/>', {
			'class': 'romeolicence',
			html: '<div style="font-size:smaller;">This data is sourced from Sherpa/Romeo and licensed under a <a href="http://creativecommons.org/licenses/by-nc-sa/2.5/">Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License</a>.</div><a href="http://www.sherpa.ac.uk/RoMEO.php"><img src="http://demonstrators.ostephens.com/sherpa-it/sherparomeo.jpg" /></a>'
	}).insertAfter('div.page-header');
	$("dd:contains('ISSN:')").each(function() {
		var items = [];
		var arr = $(this).text().match(/ISSN:(.*)/);
		$.getJSON('http://demonstrators.ostephens.com/sherpa-it/sherpait.php?issn=' + arr[1] + '&callback=?', function(data) {
			console.log(data);
			if (data.Error) {
				items.push('<strong>' + data.Error + '</strong>');
			} else {
				items.push('<strong>');
				items.push('Sherpa/RoMEO Information for "' + arr[1] + ' (' + data.jtitle + ')' + '"</strong>');
				items.push('<ul>');
				$.each(data.publishers, function(key, val) {
					items.push('<li id="' + val.publisher + '"><strong>Publisher:</strong> ' + val.publisher + '</li>');
					items.push('<li id="' + val.colour + '"><strong>RoMEO:</strong> This is a RoMEO <a href="http://www.sherpa.ac.uk/romeo/definitions.php#colours">' + val.colour + '</a> journal</li>');
				});
				items.push('</ul>');
			}
			console.log(items);
			$html = items.join('');
			console.log($html);
			$('<div/>', {
					'class': 'sherpait',
					html: $html
			}).insertAfter('div.page-header');
			$("#waiting").hide();
		});
	})
}
