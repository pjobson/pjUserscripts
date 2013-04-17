// ==UserScript==
// @name        Gun Shop OOS Hider
// @namespace   http://jobson.us
// @description Hides or obfuscates OOS items.
// @include     http*://*.palmettostatearmory.com/*
// @include     http*://palmettostatearmory.com/*
// @include     http*://*.jsesurplus.com/*
// @include     http*://jsesurplus.com/*
// @include     http*://*.rainierarms.com/*
// @include     http*://rainierarms.com/*
// @include		http*://ar15depot.com/*
// @include		http*://*.ar15depot.com/*
// @include		http*://*.wideners.com/*
// @include		http*://wideners.com/*
// @require     https://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js
// @version     1
// ==/UserScript==

addStyles();

function addStyles() {
	GM_addStyle('.OOS       { display: none; }');
	GM_addStyle('.soldOut   { background-color: silver; }');
	GM_addStyle('#totalOOS  { font-weight: bold; color: red; }');
	GM_addStyle('#itemCount { font-weight: bold; }');
	GM_addStyle('#toggleOOS { cursor: pointer; text-decoration: underline; }')
	GM_addStyle('.normalText { font-weight: normal; }');
	
	// palmettostatearmory styles
	GM_addStyle('#psaOOStools  { position: absolute; float: left; top: 22px; }');
	GM_addStyle('#psaToggleOOS { cursor: pointer; text-decoration: underline; }');
	
	// jsesurplus styles
	GM_addStyle('div#JSEprodlistWrapper    { margin-bottom: 1em; padding: 0; }');
	GM_addStyle('div#JSEprodlistWrapper br { clear: left; }');
	GM_addStyle('ul#JSEproductlist li      { list-style: none; }');
	GM_addStyle('ul#JSEproductlist         { width: 100%; }');
	GM_addStyle('ul#JSEproductlist li      { float: left; min-height: 450px; width: 350px; border: 1px solid silver; clear: none; }');
	GM_addStyle('#jseToggleOOS             { cursor: pointer; text-decoration: underline; }');
	
	// rainierarms styles
	GM_addStyle('#raOOScont   { margin-left: 15px; }')
	GM_addStyle('#raToggleOOS { cursor: pointer; text-decoration: underline; }');
	
	// ar15depot styles
	GM_addStyle('#a15dToggleOOS { cursor: pointer; text-decoration: underline; }');

};


var palmettostatearmory = {
	pageType: $('li.item:first').parent().hasClass('products-grid') ? 'grid' : 'list',
	pages: $('div.page ol:first li a[href*="p="][title!="Next"][title!="Previous"]'),
	pFin: 0,
	OOS: 0,
	init: function() {
		this.setToList();
		this.addToToolBar();
		this.getPages();
		
		$('#psaToggleOOS').live('click',function() {
			$('p.out-of-stock').parents('li.item').toggleClass('OOS');
		});
	},
	setToList: function() {
		$('p.view-mode').remove();
		if (this.pageType === 'grid') {
			if (window.location.search.match(/mode=grid/)) {
				window.location.href = window.location.href.replace(/mode=grid/,'mode=list');
			} else if (window.location.search.length === 0) {
				window.location.href = window.location.href+'?mode=list';
			} else if (window.location.search.length > 0) {
				window.location.href = window.location.href+'&mode=list';
			}
		}
	},
	getPages: function() {
		$('div.pager').remove();
		if ($(this.pages).length === 0) {
			this.allPagesLoaded();
			return;
		}
		
		var that = this;
		$(this.pages).each(function(i) {
			GM_xmlhttpRequest({
				that: that,
				method: "GET",
				url: $(this).attr('href'),
				onload: function(res) {
					$(res.responseText).find('div.category-products li.item').each(function() {
						$('ol#JSEproductlist').append($(this));
					});
					
					if (++this.that.pFin === this.that.pages.length) this.that.allPagesLoaded();
				}
			});
		});
	},
	addToToolBar: function() {
		$('div.toolbar:first').append('<div id="psaOOStools">Total OOS: <span id="totalOOS">0</span> of <span id="itemCount">0</span> items | <span id="psaToggleOOS">TOGGLE OOS</span></div>');
	},
	allPagesLoaded: function() {
		$('p.out-of-stock').parents('li.item').toggleClass('OOS');
		var oosItemCount    = $('p.out-of-stock').parents('li.item').length;
		var totalItemsCount = $('ol.products-list li.item').length;
		$('#totalOOS').text(oosItemCount);
		$('#itemCount').text(totalItemsCount);
	}
};

var jsesurplus = {
	items: $('div.product-list-item'),
	OOS: 0,
	init: function() {
		this.updateItems();
		this.toggleOOS();
		this.updateTools();
		
		$('#jseToggleOOS').live('click',this.toggleOOS);
		
	},
	updateTools: function() {
		$('td.product-list-size').remove();
		
		$('td.product-list-results').text('').append('Total OOS: <span id="totalOOS">0</span> of <span id="itemCount">0</span> items | <span id="jseToggleOOS">TOGGLE OOS</span>');
		
		$('#totalOOS').text(this.OOS);
		$('#itemCount').text($(this.items).length);
	},
	updateItems: function() {
		$('table.product-list').remove();
		
		$('table.product-list-results-header').after('<div id="JSEprodlistWrapper"><ul id="JSEproductlist"></ul><br/></div>');
		
		$(this.items).each(function() {
			$('ul#JSEproductlist').append('<li></li>');
			$('ul#JSEproductlist li:last').append($(this));
		});
	},
	toggleOOS: function() {
		var that = this;
		that.OOS = 0;
		$('div.product-list-options div[style]').each(function() {
			if ($(this).text().match(/(out of stock|back ordered)/)) {
				$(this).parents('li:first').toggleClass('OOS');
				that.OOS++;
			}
		});
	}
};

var rainierarms = {
	init: function() {
		if ($('div.product_snapshot').length === 0) return;
		if (/page=shop\/detail/.test(window.location.search)) return;
		if (/pagenumber=([2-9]|1\d)/.test(window.location.href)) {
			window.location.href = window.location.href.replace(/pagenumber=\d+/,'pagenumber=1')
		}
		this.viewAll();

		var that = this;
		$('#raToggleOOS').live('click',this.toggleOOS);
	},
	viewAll: function() {
		if ($('div#paging').length === 0) {
			this.toggleOOS();
			this.updateTools();
			return;
		}
		var that = this;
		this.itemCount = $('div#paging:first a.pages').length;
		$('div#paging:first a.pages').each(function() {
			GM_xmlhttpRequest({
				that: that,
				method: "GET",
				url: 'http://www.rainierarms.com/'+ $(this).attr('href'),
				onload: function(res) {
					$(res.responseText).find('div.product_snapshot').each(function() {
						$('div#column2').append($(this));
					});
					
					if (--this.that.itemCount === 0) {
						this.that.toggleOOS();
						this.that.updateTools();
					}
				}
			});

			$('div#paging').remove();
		});
	},
	toggleOOS: function() {
		$('img[src="/img/layout/notifyme.gif"],img[src="/img/buttons/outofstock.gif"]').each(function() {
			$(this).parents('div.product_snapshot').toggleClass('OOS');
		});
	},
	updateTools: function() {
		$('div#column2 h3').after('<div id="raOOScont">Total OOS: <span id="totalOOS">0</span> of <span id="itemCount">0</span> items | <span id="raToggleOOS">TOGGLE OOS</span></div>');


		$('span#totalOOS').text($('.OOS').length);
		$('span#itemCount').text($('div.product_snapshot').length);
	}
};

var ar15depot = {
	prodCount: 0,
	oosCount: 0,
	deepTR: $('#Table_01 tbody tr:eq(0)').siblings('tr:eq(3)').find('td:first').siblings().find('table:first tbody tr'),
	init: function() {
		// re-enable right click
		document.oncontextmenu=function() { return true; }
		if($('#Table_01').length === 0) return;

		this.productParser();
		this.toggleOOS();
		this.updateTools();

		$('#a15dToggleOOS').live('click',this.toggleOOS);
	},
	productParser: function() {
		$(this.deepTR).each(function(i) {
			if (i<3) return;
			$(this).addClass('prod');
			var soRe = new RegExp('sold.*out','igm');
			if (soRe.test($(this).text().replace(/[\r\n\t]/g,'')) === false) return;
			$(this).addClass('soldOut');
		});
	},
	toggleOOS: function() {
		$('.soldOut').toggleClass('OOS');
	},
	updateTools: function() {
		$($(this.deepTR)[0]).after('<tr><td colspan="4">Total OOS: <span id="totalOOS">0</span> of <span id="itemCount">0</span> items | <span id="a15dToggleOOS">TOGGLE OOS</span></td></tr>');

		$('#totalOOS').text($('.soldOut').length);
		$('#itemCount').text($('.prod').length);
	}

};

var wideners = {
	pcount: $('table[width="80%"] tbody tr[bgcolor]').length,
	init: function() {
		if (/itemview/.test(window.location.href) === false) return;
		this.updateTools();
		this.getPages();

		$('#toggleOOS').live('click',this.toggleOOS);
	},
	updateTools: function() {
		$('div.pagination').hide();

		$('div.headerscss').append('<br/>');
		$('div.headerscss').append('<span class="normalText">Total OOS: <span id="totalOOS">0</span> of <span id="itemCount">0</span> items | <span id="toggleOOS">TOGGLE OOS</span></span>');
	},
	productParser: function() {
		$('table[width="80%"] tbody tr[bgcolor]').each(function() {
			if (/OUT OF STOCK/.test($(this).find('td:eq(2)').text())) {
				$(this).addClass('soldOut');
			}
		});

		$('#totalOOS').text($('.soldOut').length);
		$('#itemCount').text(this.pcount);

		this.toggleOOS();
	},
	toggleOOS: function() {
		$('.soldOut').toggleClass('OOS');
	},
	getPages: function() {

		if ($('td.pag_links:first a[title~="Page"]').length === 0) {
			this.productParser();
			return;
		}

		var that = this;
		$('td.pag_links:first a[title~="Page"]').each(function(i) {
			GM_xmlhttpRequest({
				that: that,
				method: "GET",
				url: $(this).attr('href'),
				onload: function(res) {
					var plist = $(res.responseText).find('table[width="80%"] tbody tr[bgcolor]');
					that.pcount += $(plist).length;
					$('table[width="80%"] tbody').append(plist);

					if ($('td.pag_links:first a[title~="Page"]').length == i) {
						that.productParser();
					}
				}
			});

		});
	}
};


switch (document.domain) {
	case 'www.jsesurplus.com':
	case 'jsesurplus.com':
		jsesurplus.init();
		break;
	case 'palmettostatearmory.com':
	case 'www.palmettostatearmory.com':
		palmettostatearmory.init();
		break;
	case 'rainierarms.com':
	case 'www.rainierarms.com':
		rainierarms.init();
		break;
	case 'ar15depot.com':
	case 'www.ar15depot.com':
		ar15depot.init();
		break;
	case 'wideners.com':
	case 'www.wideners.com':
		wideners.init();
		break;
	default: break;
};


