/**
 * Created by christhaw on 2/4/16.
 *
 * This utility object represents a game screen view
 * shown from the user perspective
 */
define('screen', ['exports', 'utility', 'stage'], function (screen, utility, stage) {

    var self = {
        screenLock: null,
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
        }
    };

    screen.reload = function () {
        self.stage = {
            dimension: stage.element().getBoundingClientRect(),
            container: stage.element()
        };
    };
});
//function Screen(config) {
//
//    var self = this, screenLock, screenLocked = false;
//
//    self.lockOn = function(object) {
//        if (!object || !object.height || object.width) return;
//
//        screenLocked = true;
//        screenLock = setInterval(function() {
//        }, 1);
//    };
//
//    self.releaseLock = function() {
//        clearInterval(screenLock);
//        screenLocked = false;
//    };
//}