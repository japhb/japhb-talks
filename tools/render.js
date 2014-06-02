#!/usr/bin/env phantomjs

// PhantomJS script to render part of an HTML file as an image

var page     = require('webpage').create();
var system   = require('system');

if (system.args.length < 3 || system.args.length > 4) {
    console.log('Usage: ' + system.args[0] + ' source-file out-file selector');
    phantom.exit();
}

var address  = system.args[1];
var output   = system.args[2];
var selector = system.args[3];

page.viewportSize = { width: 1024, height: 1024 };
page.open(address, function (status) {
    if (status !== 'success') {
        console.log("Unable to load '" + address + "'");
        phantom.exit();
    }

    // https://github.com/superbrothers/capturejs/blob/master/lib/capturejs.js#L62
    var rect = page.evaluate(function () {
        var func = function (selector) {
            document.body.bgColor = 'white';
            if (typeof selector === 'undefined') return null;
            var elem = document.querySelector(selector);
            return elem == null ? null : elem.getBoundingClientRect();
        };
        return 'function() { return (' + func.toString() + ').apply(this, ' + JSON.stringify([selector]) + ');}';
    }());

    if (rect !== null) page.clipRect = rect;
    page.render(output);
    phantom.exit();
});
