// ==UserScript==
// @name        Swappa Mods
// @namespace   http://jobson.us
// @description Modifies swappa to hide OOS phones and sort by price.
// @include     http://swappa.com/devices/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1
// @grant       GM_addStyle
// ==/UserScript==

var items = $('div.dev_grid ul li');

$('ul.nav-pills').append('<li id="subnav_keyboard_li"><a>Price Sort: <span class="PS red">ASC</span>/<span class="PS red">DSC</span></a></li>');
$('ul.nav-pills').append('<li id="subnav_keyboard_li"><a class="red" id="rOOS">Remove\u00a0OOS</a></li>');


GM_addStyle('span.PS, a#rOOS { cursor: pointer; }')
GM_addStyle('.red { color: red; }')

$('a#rOOS').on('click',function() {
	$(items).each(function() {
		var inv = parseInt($(this).find('div.dev_cell_prices_3 a').text().match(/\((\d+)\)/)[1],10);
		if (inv>0) return;
		$(this).remove();
		items = $('div.dev_grid ul li');
	});
});

$('span.PS').on('click',function() {
	var dir = $(this).text();
	items = items.sort(function(a,b) {

		var aP = parseInt($(a).find('.dev_cell_prices_3 a').text().match(/\$\s*(\d+)/)[1],10);
		var bP = parseInt($(b).find('.dev_cell_prices_3 a').text().match(/\$\s*(\d+)/)[1],10);
		if (dir === 'ASC') {
			return (aP>bP) ? 1 : (bP>aP) ? -1 : 0;
		} else {
			return (aP>bP) ? -1 : (bP>aP) ? 1 : 0;
		}
	});
	
	$('div.dev_grid ul').empty().append($(items));
});

