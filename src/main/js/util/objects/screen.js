/**
 * Created by christhaw on 2/4/16.
 *
 * This utility object represents a game screen view
 * shown from the user perspective
 */
define('screen', ['exports', 'utility', 'stage'], function (screen, utility, stage) {

    var self = {
        screenLocked: false,
        screenLock: 0,
        lockObject: false,
        window: window,
        stage: null
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
            console.log('Invalid entity object. Game screen cannot lockOn');
            return;
        }

        console.log('Locking on object ' + entity.id);
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
});