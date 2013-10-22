// ==UserScript==
// @name        RSR Fixes
// @namespace   http://jobson.us
// @include     http://www.rsrgroup.com/catalog/search*
// @version     1
// ==/UserScript==

var $ = unsafeWindow.$;
var assc;
var baseUrl = window.location.href;
var totalRes = 0;
var pages = 0;
var curPageSet = 0;

var rsrfixes = {
	init: function() {
		rsrfixes.scanPages();
	},
	scanPages: function() {
		if ($('div.pagination').html().trim() === "") return;
		totalRes = parseInt($('p.show-results').html().match(/of (\d+)/)[1],10);
		pages    = Math.ceil(totalRes/30);
		
		rsrfixes.loadNextPage();

		$('div.pagination').empty();
		$('p.show-results').empty();

	},
	loadNextPage: function() {
		curPageSet += 30;
		if (totalRes-curPageSet < 0) {
			rsrfixes.nixAllocated();
			return;
		};
		var url = baseUrl+curPageSet;
		$.ajax({
			url: url,
			type: "get",
			data: 'subpage',
			success: function(html){
				var items = $(html).find('form div.closed-results-row');
				$('form[name="itemlist"]').append($(items));
				rsrfixes.loadNextPage();
			}
		});
	},
	nixAllocated: function() {
		$('form div.closed-results-row').each(function() {
			var avail = $(this).find('p.availability').html().replace(/<.+?>/g,'').replace(/[\r\n\t]/g,'');
			if (/:Allocated/.test(avail) || /:0 units/.test(avail)) {
				$(this).hide();
			}
		});
	}
}

$(document).ajaxSuccess(function(ev,http,args) {
	if (args.data === "subpage") return;
	if (assc) {
		clearTimeout(assc);
	}
	assc = setTimeout(rsrfixes.init,1500);
});

$( document ).ready(rsrfixes.init);

