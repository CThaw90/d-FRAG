/**
 * Created by christhaw on 2/4/16.
 *
 * This utility object represents a game screen view
 * shown from the user perspective
 */
define('screen', ['exports', 'utility', 'stage', 'debug'], function (screen, utility, stage, debug) {

    var self = {
        screenLocked: false,
        fadeActive: false,
        lockObject: false,
        screenLock: 0,
        window: window,
        stage: null
    };

    self.fadeElement = self.window.document.createElement('div');
    self.fadeElement.setAttribute('id', 'screenFadeElement');
    self.fadeElement.setAttribute('class', 'full-screen');
    self.fadeCSSObject = {
        transition: 'opacity 3s',
        position: 'absolute',
        left: 0,
        top: 0
    };

    screen.fadeFromBlack = function (timeout) {
        var t = utility.isNumber(timeout) ? timeout : 3;
        if (!self.fadeActive) {
            self.window.document.body.appendChild(self.fadeElement);
            self.fadeActive = true;
        }
        self.fadeElement.setAttribute('style', utility.jsonToCSS(self.fadeCSSObject));
        self.fadeCSSObject.transition = 'opacity ' + t + 's';
        self.fadeCSSObject.opacity = 0;
        self.window.setTimeout(function () {
            self.fadeElement.setAttribute('style', utility.jsonToCSS(self.fadeCSSObject));
            self.window.setTimeout(function () {
                self.window.document.body.removeChild(self.fadeElement);
                self.fadeActive = false;
            }, timeout * 1000);
        }, 1);
    };

    screen.height = function () {
        return self.window.innerHeight + 'px';
    };

    screen.width = function () {
        return self.window.innerWidth + 'px';
    };

    screen.reposition = function (x, y) {
        if (utility.isNumber(x) && utility.isNumber(y)) {
            self.window.scrollTo(x, y);
        }
    };

    screen.resize = function () {};
    /**
     * @description locks the game screen on an object moving across the stage
     * @param entity - the entity object that is being tracked
     */
    screen.lockOn = function (entity) {
        if (!entity.id || !entity.height || !entity.width) {
            debug.warn('Invalid entity object. Game screen cannot lockOn');
            return;
        }

        self.lockObject = entity;
        self.screenLock = setInterval(function () {
            var scrollLimitX = stage.width - parseInt(screen.width()),
                scrollLimitY = stage.height - parseInt(screen.height()),
                locationX = entity.x + (entity.width / 2),
                locationY = entity.y + (entity.height / 2),
                adjustPointX, adjustPointY;

            adjustPointY = locationY - (parseInt(screen.height()) / 2);
            adjustPointX = locationX - (parseInt(screen.width()) / 2);

            adjustPointY = adjustPointY < scrollLimitY ? adjustPointY : scrollLimitY;
            adjustPointX = adjustPointX < scrollLimitX ? adjustPointX : scrollLimitX;

            adjustPointY = (adjustPointY > 0 ? adjustPointY : 0);
            adjustPointX = (adjustPointX > 0 ? adjustPointX : 0);

            scrollTo(adjustPointX, adjustPointY);
        }, 1);

        self.screenLocked = true;
    };

    screen.releaseLock = function () {
        clearInterval(self.screenLock);
        self.screenLocked = false;
        self.lockObject = false;
    };

    screen.reload = function () {
        self.stage = {
            dimension: stage.element().getBoundingClientRect(),
            container: stage.element()
        };

        if (self.screenLocked) {
            clearInterval(self.screenLock);
            screen.lockOn(self.lockObject);
        }
    };

    screen.isLocked = function () {
        return self.screenLocked;
    };

    screen.returnSelf = function () {
        return self;
    };
});