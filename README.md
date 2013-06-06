# pjUserscripts

My userscripts mostly migrated from userscripts.org

* <a href="#installation">Installation</a>
  * Installation instruction for scripts.
* <a href="#google_domain_blockeruserjs">Google Domain Blocker</a>
  * Blacklisting of domains in google, helps filter garbage results.
* <a href="#gun_shop_oos_hideruserjs">Gun Shop Out of Stock Hider</a>
  * Hides out of stock items for gun shops.
* <a href="#thetvdb_hide_non-englishuserjs">TheTVDB Hide Non-English</a>
  * Hides non-English results on TheTVDB.
* <a href="#craigslist_image_vieweruserjs">Craigslist Image Viwer</a>
  * Shows craigslist images.

## Installation

* For Firefox Install GreaseMonkey - https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
* For Chrome Install Tampermonkey - https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
  * I'm not 100% sure these will all work on Tampermonkey, if you find a bug please report it.
* Install the scripts with either of these:
  * Clone the repo and drag the .js files into your browser.
  * Click the script you want to install, click on "RAW", select INSTALL from the dialog box.

## `Google_Domain_Blocker.user.js`

Blocks junk domains from google.com SERP.

Originally: https://userscripts.org/scripts/show/33156

How many times do you search Google and find junk results from search engine spam sites? Then you find them again and again. Well I got pretty sick of it, so I created this userscript.

### Files

**`Google_Domain_Blocker.importList.personal.json`** - My personal blacklist, this list is pretty aggressive and probably shouldn't be used by most users.

**`Google_Domain_Blocker.importList.sample.json`** - Example blacklist blocking amazon, facebook, w3cschools, and yelp.

### Features

#### Blacklisting Domains

I tried to make blacklisting of domains as straight forward as possible.  Move your cursor over any of the results and you'll see "Blacklist Domain" appear in the left hand side.  Click "Blacklist Domain" and a confirmation will appear, select Yes or No to confirm.

**Basic SERP**

![Basic SERP](http://jobson.us/github/pjUserscripts/screen_shots/gdb-serp_01-plain.png)

**Mouse Over SERP**

![Mouse Over SERP](http://jobson.us/github/pjUserscripts/screen_shots/gdb-serp_02-blacklist_domain.png)

**Blacklist Confirmation**

![Blacklist Confirmation](http://jobson.us/github/pjUserscripts/screen_shots/gdb-serp_03-confirmation.png)

**Result Blacklisted**

![Result Blacklisted](http://jobson.us/github/pjUserscripts/screen_shots/gdb-serp_04-blacklisted_result.png)

#### Your Blacklist

**Firefox**

You may view the blacklist preferences through the menu or the greasemonkey icon.  Selecting either of these brings up "Your Blacklist".

![GreaseMonkey Menu Command](http://jobson.us/github/pjUserscripts/screen_shots/gdb-menu_user_script_command.png)

![GreaseMonkey User Script Command](http://jobson.us/github/pjUserscripts/screen_shots/gdb-gm_icon_user_script_command.png)

**Chrome**

You may view thte blacklist preferences through the Tampermonkey icon.

![Tampermonkey User Script Command](http://jobson.us/github/pjUserscripts/screen_shots/gdb-tm_icon_command.png)

**Your Blacklist Empty and Populated**

![Your Blacklist](http://jobson.us/github/pjUserscripts/screen_shots/gdb-your_blacklist.png)

##### Preferences

There are four prefereces you can set:

* Blacklist Enabled
  * Toggles the script.
* Display Messages
  * Shows "domain blacklisted" in SERP.
* RegEx Blocker
  * Uses regular expressions to block domain names.
* Auto Block Malware
  * Automatically blocks domains marked by Google as Malware.
* Blacklist News
  * Hides the google news widget.

![Preferences](http://jobson.us/github/pjUserscripts/screen_shots/gdb-preferences.png)

##### Import/Export

Allows you to import or export your full blacklist in JSON format.

![Import/Export](http://jobson.us/github/pjUserscripts/screen_shots/gdb-import_export.png)

## `Gun_Shop_OOS_Hider.user.js`

This is a work in progress to modifiy the results from various gun shops. 

## `TheTVDB_Hide_Non-English.user.js`

Simply hides non-English results from TheTVDB's result list.

## `Craigslist_Image_Viewer.user.js`

Automatically shows all images in search results in Craigslist, I like using this more than the default functionality that CL offers.
