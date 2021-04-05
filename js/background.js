(function() {
	"use strict";
	var chrome = chrome || browser;

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
			chrome.tabs.executeScript(tabId, {
				file: 'content.js'
			}, () => chrome.runtime.lastError);
	});

	chrome.tabs.onCreated.addListener(function(tab) {
		chrome.tabs.executeScript(tab.id, {
			file: 'content.js'
		}, () => chrome.runtime.lastError);
	});
})();