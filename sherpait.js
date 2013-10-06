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
			html: '<div id="loading"><p><img src="http://demonstrators.ostephens.com/kbplus/sherpa-it/ajax-loader.gif" /><br />Sherpa-It is checking Sherpa/Romeo for information, please wait</p>'
	}).insertAfter('div.page-header');
	var issns = [];
	if ($("dd > ul > li:contains('ISSN:')").length > 0) {
		$("dd > ul > li:contains('ISSN:')").each(function(index) {
			var arr = $(this).text().match(/e?ISSN:(.*)/);
			if (arr.length > 1) {
				issns.push(arr[1]);
			}
		});
	}
	var no_issns = issns.length;
	//Re-write php to allow multiple ISSNs to be looked up, merge stuff, build the json
	//Then can do all the html building in the getJson function - which has to be how its done
	// Otherwise asychronous nature means items not populated before data returned
	if (no_issns > 0) {
		issns_s = issns.join(',');
	    $.getJSON('http://demonstrators.ostephens.com/kbplus/sherpa-it/sherpait.php?issns=' + issns_s + '&callback=?', function(data) {
			var items = [];
			$.each(data.journals, function(j, journal) {
				if (journal.Error) {
					items.push('<strong>' + journal.Error + '</strong>');
				} else {
					items.push('<strong>');
					items.push('Sherpa/RoMEO Information for ISSN: "' + journal.issn + ' (' + journal.jtitle + ')' + '"</strong><br />');
					items.push('<a href="http://www.sherpa.ac.uk/romeo/search.php?issn=' + journal.issn + '">[Link to Sherpa/RoMEO record]</a>');
					items.push('<ul>');
					$.each(journal.publishers, function(key, val) {
						items.push('<li id="' + val.publisher + '"><strong>Publisher:</strong> ' + val.publisher + '</li>');
						items.push('<li id="' + val.colour + '"><strong>RoMEO:</strong> This is a RoMEO <a href="http://www.sherpa.ac.uk/romeo/definitions.php#colours">' + val.colour + '</a> journal</li>');
					});
					items.push('</ul>');
				}
			});
			$html = items.join('');
			$('<div/>', {
					'class': 'sherpait',
					html: $html
			}).insertAfter('div.page-header');
			$('<div/>', {
			'class': 'romeolicence',
			html: '<div style="font-size:smaller;">This data is sourced from Sherpa/Romeo and licensed under a <a href="http://creativecommons.org/licenses/by-nc-sa/2.5/">Creative Commons Attribution-NonCommercial-ShareAlike 2.5 License</a>.</div><a href="http://www.sherpa.ac.uk/RoMEO.php"><img src="http://demonstrators.ostephens.com/kbplus/sherpa-it/sherparomeo.jpg" /></a>'
	}).insertAfter('div.page-header');
			$("#waiting").hide();
		});
	} else {
		// No ISSN or eISSN so display message
		$('<div/>', {
				'class': 'sherpait',
				html: "Could not find an ISSN to use for Sherpa/RoMEO lookup"
			}).insertAfter('div.page-header');
		$("#waiting").hide();
		$(".romeolicence").hide();
	}
}