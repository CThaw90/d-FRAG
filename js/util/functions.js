/**
 * Created by Chris on 10/7/2015.
 *
 * These are common utility functions that can be
 * conveniently used anywhere around the app.
 */

var $util = {

    // Checks if a variable is javascript object
    isObject: function(o) {
        return o.toString() === '[object Object]';
    },

    //Checks if a variable is an HtmlBodyElement
    isHtmlElement: function(h) {
        return h.toString().search($const.htmlObjectRegex) !== -1;
    },

    // Returns the full height of the gaming screen
    getWindowHeight: function() {
        return window.innerHeight - $const.screenOffset;
    },

    // Returns the full width of the gaming screen
    getWindowWidth: function() {
        return window.innerWidth - $const.screenOffset;
    }
};