/**
 * Created by Chris on 10/7/2015.
 *
 * These are common utility functions that can be
 * conveniently used anywhere around the app.
 */

var _util = {

    // Checks if a variable is a javascript number
    isNumber: function(n) {
        return typeof n === 'number';
    },

    // Checks if a variable is a javascript string
    isString: function(s) {
        return typeof s === 'string';
    },

    // Checks if a variable is javascript object
    isObject: function(o) {
        return o && !this.isArray(o) && typeof o === 'object';
    },

    // Checks if a variable is a javascript array
    isArray: function(a) {
        return Array.isArray(a);
    },

    // Checks if a variable is javascript function
    isFunction: function(f) {
        return f && typeof f === 'function';
    },

    // Checks if a variable is an HtmlElement
    isHtmlElement: function(h) {
        return h && h.toString().search(_const.htmlObjectRegex) !== -1
            && typeof o === 'object';
    },

    // Returns the full height of the gaming screen
    // This function may be deprecated
    getWindowHeight: function() {
        return window.innerHeight + 'px';
    },

    // Returns the full width of the gaming screen
    // This function may be deprecated
    getWindowWidth: function() {
        return window.innerWidth + 'px';
    },

    // Converts an array to an object with given value
    arrayToObject: function(array, value) {
        var object = {};
        if (this.isArray(array)) {
            for (var i=0; i < array.length; i++) {
                object[array[i]] = value;
            }
        }

        return object;
    },

    // Converts a set of css rules into JSON
    cssToJSON: function(css) {
        var rules = css.split(';'),
            object = {}, keyValue;

        if (typeof css !== 'string')
            return null;

        for (var i=0; i < rules.length; i++) {
            keyValue = rules[i].split(':');
            if (keyValue.length === 2)
                object[keyValue[0].trim()]=keyValue[1].trim();
        }
    },

    // Converts a JSON object into css rules
    jsonToCSS: function(object) {
        var css = String();

        if (typeof object !== 'object' || object.toString() !== '[object Object]')
            return null;

        for (var key in object) {
            css += key+': '+object[key]+'; ';
        }

        return css;
    },

    // A modified deferred function that waits until an input function returns true
    // before executing a given output function
    waitUntil: function (thisReturnsTrue, withArgs0, toExecute, withArgs1, config) {

        if (!this.isFunction(thisReturnsTrue) || !this.isFunction(toExecute)) return;
        if (!config) config = {interval: _const.defaultInterval, limit: _const.maxLimit};

        var returnFunction = this.buildFunctionFromArray('thisReturnsTrue', withArgs0),
            executeFunction = this.buildFunctionFromArray('toExecute', withArgs1),
            iteration = 0;

        var wait = setInterval(function() {
            if (iteration > limit) {
                clearInterval(wait);
                return;
            } else if (eval(returnFunction)) {
                eval(executeFunction);
                clearInterval(wait);
            }
            iteration++;

        }, (config.interval ? config.interval : 10)), limit = (!isNaN(config.limit) ? config.limit : _const.maxLimit);
    },

    // Builds a function call with a given name and arguments provided by an array
    buildFunctionFromArray: function(name, args) {

        var buildFunction = name + '(', a = 0;
        while (a < args.length) {
            if (typeof args[a] === 'string') {
                buildFunction += ('"' + args[a++] + '"');
            }
            else if (typeof args[a] === 'number') {
                buildFunction += args[a++];
            }
            if (a < args.length)
                buildFunction += ',';
        }

        return buildFunction + ')';
    },

    // Returns true when all of the Browser DOM elements has finished loading
    domLoaded: function() {
        return document.readyState === 'complete';
    },

    // Makes call to adding a new event Listener a bit more cleaner
    addListener: function(event, func) {
        document.addEventListener(event, func);
    }
};