/**
 * Created by Chris on 10/7/2015.
 */

var _const = {

    basePath: 'http://' + location.hostname + location.pathname,
    keyPress: 'keypress',
    keyDown: 'keydown',
    keyUp: 'keyup',
    arrowLeft: 37,
    arrowUp: 38,
    arrowRight: 39,
    arrowDown: 40,

    faceRight: 'Right',
    faceLeft: 'Left',
    faceDown: 'Down',
    faceUp: 'Up',

    defaultFrameRate: 100,
    defaultInterval: 10,
    maxLimit: 1000,

    stageHeight: window.innerHeight,
    stageWidth: window.innerWidth,

    screenOffset: 16,

    // Regular Expression objects
    // ----------------------------------

    // Checks to determine if string represents an Html Object
    htmlObjectRegex: /^\[object\sHTML(?:.*?)]/,


    // Color Schemes
    // ----------------------------------
    black: '#000000'

};