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

    right: 'right',
    left: 'left',
    down: 'down',
    up: 'up',

    defaultFrameRate: 100,
    defaultAiInterval: 5000,
    maxLimit: 1000,

    stageHeight: window.innerHeight,
    stageWidth: window.innerWidth,

    screenOffset: 16,

    movement: 'movement',
    movementCheckInterval: 1,

    // Regular Expression objects
    // ----------------------------------

    // Checks to determine if string represents an Html Object
    htmlObjectRegex: /^\[object\sHTML(?:.*?)]/,


    // Color Schemes
    // ----------------------------------
    black: '#000000',

    // Key Map - Map of all keys and their respective key codes
    // ---------------------------------------------------------------
    keyMap: {

        backspace : 8,      tab: 9,             enter: 13,      shift: 16,      control: 17,
        alt: 18,            'pause/break': 19,  caps: 20,       escape: 27,     space: 32,
        pageUp: 33,         pageDown: 34,       end: 35,        home: 36,       leftArrow: 37,
        upArrow: 38,        rightArrow: 39,     downArrow: 40,  insert: 45,     'delete': 46,

        '0': 48,    '1': 49,    '2': 50,    '3': 51,    '4': 52,    '5': 53,    '6': 54,    '7': 55,    '8': 56,    '9': 57,

        a: 65,      b: 66,      c: 67,      d: 68,      e: 69,      f: 70,      g: 71,      h: 72,      i: 73,      j: 74,
        k: 75,      l: 76,      m: 77,      n: 78,      o: 79,      p: 80,      q: 81,      r: 82,      s: 83,      t: 84,
        u: 85,      v: 86,      w: 87,      x: 88,      y: 89,      z: 90,

        ';':186,    '=': 187,   ',':188,    '-': 189,   '.': 190,   '/': 191,   '[': 219,   '\\': 220,  ']': 221,   '\'': 222,

        leftWindowKey: 91,  rightWindowKey: 92, selectKey: 93,

        numpad0: 96,        numpad1: 97,        numpad2: 98,    numpad3: 99,    numpad4: 100,   numpad5: 101,   numpad6: 102,
        numpad7: 103,       numpad8: 104,       numpad9: 105,

        f1: 112,    f2: 113,    f3: 114,    f4: 115,    f5: 116,    f7: 118,     f8: 119,     f9: 120,    f10: 121,   f11: 122,
        f12: 123,

        numLock: 144,   scrollLock: 145
    },

    // Artificial Intelligence Configuration Types
    // ----------------------------------------------------------------
    aiRandom: 'AI_RANDOM_CONFIG',
    aiManual: 'AI_MANUAL_CONFIG',
    aiFollow: 'AI_FOLLOW_CONFIG',
    aiTarget: 'AI_TARGET_CONFIG'
};