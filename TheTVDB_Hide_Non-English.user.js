// ==UserScript==
// @name        TheTVDB Hide Non-English
// @namespace   http://jobson.us
// @description Hides non-english results from search.
// @include     http://www.thetvdb.com/?*function=Search
// @version     1
// @require        https://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js
// ==/UserScript==

$('#listtable tbody tr').each(function(i) {
	if (i===0) return;
	if (/English/.test($(this).find('td:eq(1)').text())) return;
	$(this).remove();
});

$('td.odd,td.even').removeClass('odd even');
$('#listtable tbody tr:odd').addClass('odd');
