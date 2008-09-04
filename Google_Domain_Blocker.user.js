// ==UserScript==
// @name           Google Domain Blocker
// @namespace      http://jobson.us
// @description    Blocks irrelevant and spam domains.
// @include        http://*.google.com/search*
// @include        http://google.com/search*
// ==/UserScript==

window.setTimeout(init,100);
var blacklist;
var blDIV;
var console;

function init() {
	blacklist = getBlacklist();
	blDIV = makeBLDIV();
	console = (unsafeWindow.console) ? unsafeWindow.console : '';
	addStyle();
	parseResults();
	addLinks();
	editList();
}

function editList() {
	var gb = $('gb');
		gb.appendChild(document.createTextNode(' | '));
	var sp = gb.appendChild(document.createElement('span'));
		sp.appendChild(document.createTextNode('Show Blacklist'));
		sp.setAttribute('class','blShow');
		sp.addEventListener('click',toggleBlackList,false);
}

function makeBLDIV() {
	var div = document.getElementsByTagName('body')[0].appendChild(document.createElement('div'));
		div.setAttribute('class','noShow');
	var ul = div.appendChild(document.createElement('ul'));
		ul.setAttribute('id','blDIVul');
	return div;
}

function toggleBlackList() {
	var span = document.getElementsByClassName('blShow')[0];
	if (blDIV.getAttribute('class') != 'noShow') {
		span.childNodes[0].nodeValue = span.childNodes[0].nodeValue.replace(/Hide/,'Show');
		blDIV.setAttribute('class','noShow');
	} else {
		span.childNodes[0].nodeValue = span.childNodes[0].nodeValue.replace(/Show/,'Hide');
		var ul = $('blDIVul');
		while (ul.childNodes.length>0) ul.removeChild(ul.childNodes[0]);
		var li = document.createElement('li');
		var x  = document.createElement('span');
			x.setAttribute('class','blNix');
			x.appendChild(document.createTextNode('\u2297'));
		blacklist.forEach(function(domain) {
			var lix = ul.appendChild(li.cloneNode(true));
			var nix = lix.appendChild(x.cloneNode(true));
				nix.addEventListener('click',delDomain,false);
				lix.appendChild(document.createTextNode(' '+ domain))
		});
		var lix = ul.appendChild(li.cloneNode(true));
		var inp = lix.appendChild(document.createElement('input'));
			inp.setAttribute('type','text');
			inp.setAttribute('id','blAdder');
			inp.setAttribute('value','');
		var btn = lix.appendChild(document.createElement('input'));
			btn.setAttribute('type','button');
			btn.setAttribute('id','blButton');
			btn.setAttribute('value','+');
			btn.addEventListener('click',addDomain,false);
		var lix = ul.appendChild(li.cloneNode(true));
		var div = lix.appendChild(document.createElement('div'));
			div.setAttribute('class','blNote');
			div.appendChild(document.createTextNode('(reload page to refresh deletes)'));
			div.addEventListener('click',reloadPage,false);
		blDIV.setAttribute('class','blDIV');
	}
}

function reloadPage() {
	unsafeWindow.location.reload();
}

function delDomain() {
	var domain = this.parentNode.childNodes[1].nodeValue.replace(/^\s/,'');
	if (blacklist.indexOf(domain) == -1) return;
	var tmp = [];
	blacklist.forEach(function(d) {
		if (d==domain) return;
		tmp.push(d);
	});
	GM_setValue('blacklist',tmp.join(','));
	blacklist = getBlacklist();
	toggleBlackList();
	toggleBlackList();
}

function reloadPage() {
	unsafeWindow.location.reload();
}

function addDomain() {
	var domain = $('blAdder').value;
		domain = domain.replace(/^\s+/g,'').replace(/\s+$/g,'');
	if (domain == '') return;
	addBlacklist(domain);
	parseResults();
}

function parseResults() {
	var li = $('res').getElementsByTagName('li');
	for (var i=0;i<li.length;i++){
		var domain = getDomain(li[i].getElementsByTagName('h3')[0]);
		
		if (domain && tester(domain)) {
			// Blacklisted Domain
			hideResult(li[i]);
		}
	}
}

function tester(domain) {
	for (var i=0;i<blacklist.length;i++) {
		var bl = blacklist[i];
			bl = (/^\//.test(bl) ? bl.replace(/^\//,'').replace(/\/$/,'') : '^'+ bl +'$');
		var x = new RegExp(bl);
		if (x.test(domain)) return true;
	}
	return false;
}

function hideResult(li) {
	var domain = getDomain(li.getElementsByTagName('h3')[0]);
	while(li.childNodes.length>0) li.removeChild(li.childNodes[0]);
	var span = li.appendChild(document.createElement('span'))
		span.setAttribute('class','blackout');
		span.appendChild(document.createTextNode('Result Blacklisted: '+ domain));
}

function getBlacklist() {
	return (GM_getValue('blacklist') ? GM_getValue('blacklist').split(',') : [] );
}

function addBlacklist(domain) {
	if (blacklist.indexOf(domain) > -1)	return;
	blacklist.push(domain);
	GM_setValue('blacklist',blacklist.join(','));
	blacklist = getBlacklist();
	toggleBlackList();
	toggleBlackList();
}

function addStyle() {
	GM_addStyle('span.blacklist { color: #7777CC; font-size: 13px; text-decoration: underline; cursor: pointer; }');
	GM_addStyle('span.blconfirm { color: #333333; font-size: 13px; text-decoration: none; cursor: default; }');
	GM_addStyle('span.blyesno   { color: maroon; font-size: 13px; text-decoration: none; cursor: pointer; }');
	GM_addStyle('span.blackout  { color: #333333; width: 598px; padding: 2px; font-size: 10px;');
	GM_addStyle('span.blShow    { color: #0000CC; text-decoration: underline; cursor: pointer; }');
	GM_addStyle('div.blDIV      { background-color: white; padding: 5px; border: 1px solid black; z-index: 100; position: absolute; top: 25px; right: 5px; display: inline; }');
	GM_addStyle('ul#blDIVul     { margin: 0; padding: 0; min-width: 200px; text-align: left; }');
	GM_addStyle('ul#blDIVul li  { margin: 0; padding: 0; list-style: none; font-size: 12px; }');
	GM_addStyle('div.noShow     { display: none; ');
	GM_addStyle('span.blNix     { color: maroon; cursor: pointer; }');
	GM_addStyle('input#blButton { border: 1px solid silver; font-size: 10px; width: 30px; }');
	GM_addStyle('input#blAdder  { border: 1px solid silver; font-size: 10px; width: 166px; }');
	GM_addStyle('div.blNote     { text-align: center; color: #333333; font-size: 10px; font-style:italic; cursor: pointer; }');
}

function addLinks() {
	var span = $x('//span[@class="gl"]');
	
	span.forEach(function(el) {
		el.appendChild(document.createTextNode(' - '));
		var sp = el.appendChild(document.createElement('span'));
		bldLink(sp);
	});

}

function bldLink(sp) {
	sp.setAttribute('class','blacklist');
	sp.appendChild(document.createTextNode('Blacklist Domain'));
	sp.addEventListener('click',blacklistDomain,false);	
}

function getDomain(h3) {
	try {
		var href = h3.getElementsByTagName('a')[0].getAttribute('href');
			href = /https{0,1}:\/\/(.+?)\//.exec(href)[1];
		return href;
	} catch(er) {
		return false;
	}
}

function blacklistDomain() {
	var el = this;
	var href = getDomain(el.parentNode.parentNode.parentNode.getElementsByTagName('h3')[0]);
	showConfirm(el,href);
}

function showConfirm(el,href) {
	el.removeEventListener('click',blacklistDomain,false);
	el.removeChild(el.childNodes[0])
	el.setAttribute('class','blconfirm');
	el.appendChild(document.createTextNode('Confirm: '));
	var yes = el.appendChild(document.createElement('span'));
		yes.appendChild(document.createTextNode('yes'));
		yes.setAttribute('class','blyesno');
		yes.setAttribute('domain',href);
		yes.addEventListener('mouseup',function() { blConfirm(true,this); },false);
	el.appendChild(document.createTextNode(' / '));
	var no = el.appendChild(document.createElement('span'));
		no.appendChild(document.createTextNode('no'));
		no.setAttribute('class','blyesno');
		no.addEventListener('mouseup',function() { blConfirm(false,this); },false);
}

function blConfirm(tf,el) {
	if (tf) {
		addBlacklist(el.getAttribute('domain'));
		parseResults();
	} else {
		var sp = el.parentNode;
		while(sp.childNodes.length>0) sp.removeChild(sp.childNodes[0]);
		bldLink(sp,1);
	}
}

function $x(p, context) {
	if (!context) context = document;
	var i, arr = [], xpr = document.evaluate(p, context, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
	for (i = 0; item = xpr.snapshotItem(i); i++) arr.push(item);
	return arr;
}

function $(x) {
	return document.getElementById(x);
}
