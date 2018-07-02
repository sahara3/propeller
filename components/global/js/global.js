
/*!
 * Propeller v1.3.1 (http://propeller.in)
 * Copyright 2016-2018 Digicorp, Inc.
 * Licensed under MIT (http://propeller.in/LICENSE)
 */

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Attach Parent Selector
var commons = function () {

	function commons() {}
	commons.attachParentSelector = function (parentSelector, defaultSelector) {
		var customSelector = defaultSelector;
		if (parentSelector !== '' && parentSelector.length > 0) {
			if (parentSelector === defaultSelector) {
				customSelector = defaultSelector;
			} else if ($(parentSelector).hasClass(defaultSelector)) {
				customSelector = parentSelector + "" + defaultSelector;
			} else {
				customSelector = parentSelector + " " + defaultSelector;
			}
		}
		return customSelector;
	};
	return commons;
};

// Inherit one class to another
function _inherits(SubClass, SuperClass) {
	if (typeof SuperClass !== "function" && SuperClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof SuperClass);
	}
	SubClass.prototype = new SuperClass();
}

// Propeller components Mapping
var propellerControlMapping = {
	"pmd-checkbox": function (node) {
		$(node).find('.pmd-checkbox').pmdCheckBox();
	},
	"pmd-radio": function (node) {
		$(node).find('.pmd-radio').pmdRadio();
	},
	"pmd-textfield": function (node) {
		$(node).find('.pmd-textfield').pmdTextfield();
	},
	"pmd-dropdown": function (node) {
		$(node).find('.pmd-dropdown').pmdDropdown();
	},
	"pmd-alert-toggle": function (node) {
		$(node).find('.pmd-alert-toggle').pmdAlert();
	},
	"pmd-tabs": function (node) {
		$(node).find('.pmd-tabs').pmdTab();
	},
	"pmd-sidebar": function () {
		$().pmdSidebar();
	},
	"pmd-accordion": function (node) {
		$(node).find('.pmd-accordion').pmdAccordion();
	},
	"pmd-ripple-effect": function (node) {
		$(node).find('.pmd-ripple-effect').pmdButton();
	}
};

// DOM Observer
var observeDOM = (function () {
	var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
		eventListenerSupported = window.addEventListener;
	return function (obj, callback) {
		if (MutationObserver) {
			// define a new observer
			var obs = new MutationObserver(function (mutations, observer) {
				callback(mutations);
			});
			// have the observer observe foo for changes in children
			obs.observe(obj, {
				childList: true,
				subtree: true,
				// attributes: true,
				// characterData: true
			});
		} else if (eventListenerSupported) {
			obj.addEventListener('DOMNodeInserted', callback, false);
			obj.addEventListener('DOMNodeRemoved', callback, false);
		}
	};
})();

$(document).ready(function () {
	observeDOM(document.querySelector('body'), function (mutations) {
		var targets = [];
		for (var i = 0; i < mutations.length; i++) {
			for (var j = 0; j < mutations[i].addedNodes.length; j++) {
				targets.push(mutations[i].addedNodes[j]);
			}
		}

		var node;
		while ((node = targets.shift()) !== undefined) {
			if (containsPmdClassPrefix(node)) {
				var toggle = node.getAttribute("data-toggle");
				if (toggle != null && toggle.toLowerCase() === "popover") {
					$().pmdPopover();
				}
				var className = node.getAttribute ? node.getAttribute('class') : null;
				if (className == null) {
					continue;
				}
				var classes = className.split(' ');
				classes.forEach(function (clazz) {
					if (propellerControlMapping[clazz]) {
						propellerControlMapping[clazz](node);
						return true;
					}
					return false;
				});
			} else {
				for (var n = 0; n < node.childNodes.length; n++) {
					targets.push(node.childNodes[n]);
				}
			}
		}

		function containsPmdClassPrefix(ele) {
			var className = ele.getAttribute ? ele.getAttribute('class') : null;
			if (className == null) {
				return false;
			}
			var classes = className.split(' ');
			for (var i = 0; i < classes.length; i++) {
				if (propellerControlMapping.hasOwnProperty(classes[i])) {
					return true;
				}
			}
			return false;
		}
	});
});
