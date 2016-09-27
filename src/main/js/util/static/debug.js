/**
 * Created by Chris on 9/27/2016.
 *
 */
/* globals console */
define('debug', ['exports'], function (debug) {

    var self = {};

    self.isDebugEnabled = function () {
        return window.location.search.match(/\?.*debug=/g)
    };

    self.debugInfoEnabled = function () {
        return window.location.search.match(/\?.*debug=info/i);
    };

    self.debugTraceEnabled = function () {
        return window.location.search.match(/\?.*debug=trace/i);
    };

    debug.error = function (message) {
        window.console.error(message);
    };

    debug.warn = function (message) {
        if (self.isDebugEnabled()) {
            window.console.warn(message);
        }
    };

    debug.info = function (message) {
        if (self.debugInfoEnabled() || self.debugTraceEnabled()) {
            window.console.log(message);
        }
    };

    debug.trace = function (message) {
        if (self.debugTraceEnabled()) {
            window.console.log(message);
        }
    };
});