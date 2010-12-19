// ==UserScript==
// @name           Google Domain Blocker
// @namespace      http://jobson.us
// @description    Blocks irrelevant and spam domains.
// @include        http://*.google.com/search*
// @include        http://google.com/search*
// @include        https://*.google.com/search*
// @include        https://google.com/search*
// @require        http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js
// ==/UserScript==


var g = {
	blacklist: [],
	hiddenText: '<li class="hidtxt"><span class="domain">xxx</span> blacklisted</li>',
	init: function() {
		g.eventListeners();
		g.addStyles();
		g.blacklist = g.getBlacklist();
		g.hideResults();
		g.makeBlacklistControls();
		g.addBlackListLinks();
	},
	eventListeners: function() {
		// Event listeners for this script
		$('span#showHideBlacklist').live('click',g.showHideBlacklist);
		$('span.blLink').live('click',g.blacklistThisDomain);
		$('span.blyes,span.blno').live('click',g.confirmation);
		$('input#blAddBox').live('keyup',g.manualAdd);
		$('input#blAddBtn').live('click',g.manualAdd);
		$('span.ex').live('click',g.removeFromBlackList);
	},
	addStyles: function() {
		// Adds styles to the DOM
		GM_addStyle("li.hidtxt { color: gray; font-size: 0.75em; margin: 5px 0; }");
		GM_addStyle("span.showBL { color: #0000CC; text-decoration: underline; cursor: pointer; }");
		GM_addStyle("div#blTop { position: absolute; top: "+ parseInt($('div#cnt').position().top,10) +"px; right: 5px; border: 1px solid black; width: 240px; padding: 0; }");
		GM_addStyle("ul#blacklist li { list-style: none; margin: 0; padding: 1px 0 1px 0; }");
		GM_addStyle("span.ex { color: #DF0101; cursor: pointer; } ");
		GM_addStyle("span.blLink { color: #4272DB; cursor: pointer; } ");
		GM_addStyle("span.blConfirm { color: black; display: none; }");
		GM_addStyle("span.blConfirm span { color: #DB4272; cursor: pointer; }");
		GM_addStyle("div#blULContainer { height: 300px; overflow: auto; margin: 5px; }");
		GM_addStyle("div#blForm { margin-top: 5px; padding: 5px; }");
		GM_addStyle("li.hidtxt span.domain { font-style: italic; }");
		GM_addStyle("div#blText { background-color: silver; color: black; padding: 3px; text-align: center; font-weight: bold; }");
	},
	saveBlacklist: function() {
		// Saves g.blacklist to greasemonkey blacklist
		GM_setValue('blacklist',g.blacklist.join(','));
	},
	addToBlackList: function(domain) {
		// Adds an entry to the blacklist
		g.blacklist.push(domain);
		g.blacklist = g.blacklist.uniq().sort();
		g.saveBlacklist();
		// Show the results first, stop duplication errors.
		g.showResults();
		g.hideResults();
		g.buildList();
	},
	removeFromBlackList: function() {
		// Removes an entry from the blacklist
		var domain = $(this).parent().find('span.domain').text();
		g.blacklist = g.blacklist.remove(domain);
		g.saveBlacklist();
		// Show the results first, stop duplication errors.
		g.showResults();
		g.hideResults();
		g.buildList();
	},
	manualAdd: function(ev) {
		// manually add a domain to the blacklist
		if ($('input#blAddBox').attr('value') == '') return;
		
		// I'm lazy, so I'm using the same function for keypress and a click
		if(ev.keyCode != 13 && $(this).attr('id')== 'blAddBox') return;

		g.addToBlackList($('input#blAddBox').attr('value'));
		$('input#blAddBox').attr('value','');
	},
	addBlackListLinks: function() {
		// Adds blacklist & confirm links to each SERP
		$('li.g span.f span.gl').each(function() {
			$(this).append(' - <span class="blLink">Blacklist Domain</span><span class="blConfirm">Confirm: <span class="blyes">yes</span> / <span class="blno">no</span></span>');
		});
	},
	blacklistThisDomain: function() {
		// Blacklist this domain, show the confirmation
		$(this).hide();
		$(this).parent().find('span.blConfirm').show();
	},
	confirmation: function() {
		// Shows confirmation for adding a domain to the list
		if ($(this).hasClass('blyes')) {
			g.addToBlackList($(this).parents('span.f').find('cite').text().split('/')[0]);
		} else {
			$(this).parent().hide()
			$(this).parent().prev().show();
		}
	},
	getBlacklist: function() {
		// Gets the blacklist from greasemonkey
		return (GM_getValue('blacklist') ? GM_getValue('blacklist').split(',') : [] );
	},
	hideResults: function() {
		// Hide the results using the blacklist.
		$('li.g span.f cite').each(function() {
			var domain = $(this).text().split('/')[0];
			var cite = this;
			var h = false;
			$.each(g.blacklist,function(i,key) {
				if (/^\/.+\/$/.test(key)) {
					// Regular expression
					var re = new RegExp(key.replace(/\//g,''),'i');
					if (re.test(domain)) {
						h = true;
					}
				} else if (key.toLowerCase() === domain.toLowerCase()) {
					h = true;
				}
			});
			if (h===true) {
				$(cite).parents('li.g').before(g.hiddenText.replace(/xxx/,domain));
				$(cite).parents('li.g').hide();
			}
		});
	},
	showResults: function() {
		// Shows all results
		$('li.hidtxt').remove();
		$('li.g').show();
	},
	makeBlacklistControls: function() {
		// Makes the controls for this script
		$('div#guser').append(' | <span class="showBL" id="showHideBlacklist">Show Blacklist</span>');

		$('body').append('<div id="blTop"><div id="blText">Your Blacklist</div><div id="blULContainer"><ul id="blacklist"></ul></div><div id="blForm"></div></div>');
		
		$('div#blForm').append('<input type="text" id="blAddBox" /><input type="button" value="add" id="blAddBtn" />');
		
		$('div#blTop').hide();
		
		g.buildList();
	},
	buildList: function() {
		$('li.domainEntry').remove();
		$.each(g.blacklist,function(i,key) {
			$('ul#blacklist').append('<li class="domainEntry"><span class="ex">\u2297</span> <span class="domain">'+ key +'</span></li>');
		});
	},
	showHideBlacklist: function() {
		// Shows or hides the blacklist drop menu
		if (/Show/.test($('span#showHideBlacklist').text())) {
			// show the blacklist
			$('span#showHideBlacklist').html('Hide Blacklist');
			$('div#blTop').show();
		} else {
			// hide the blacklist
			$('span#showHideBlacklist').html('Show Blacklist');
			$('div#blTop').hide();
		}
	}
};

g.init();

Array.prototype.uniq = function() {
	var old = this;
	var uniq = [];
	$.each(old,function(i,key) {
		if (uniq.indexOf(key) === -1) uniq.push(key);
	});
	return uniq;
};

Array.prototype.remove = function(word) {
	var old = this;
	var out = [];
	$.each(old,function(i,key) {
		if (key===word) return;
		out.push(key);
	});
	return out;
};