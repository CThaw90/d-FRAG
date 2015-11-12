/**
 * Created by Chris on 10/7/2015.
 *
 * These are common utility functions that can be
 * conveniently used anywhere around the app.
 */

var _util = {

    // Checks if a variable is javascript object
    isObject: function(o) {
        return o && o.toString() === '[object Object]'
            && typeof o === 'object';
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
    }
};