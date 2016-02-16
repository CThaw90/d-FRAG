/**
 * Created by christhaw on 2/4/16.
 *
 * This utility object represents a game screen view
 * shown from the user perspective
 */
function Screen(config) {

    var self = this, screenLock, screenLocked = false;

    self.lockOn = function(object) {
        if (!object || !object.height || object.width) return;

        screenLocked = true;
        screenLock = setInterval(function() {
        }, 1);
    };

    self.releaseLock = function() {
        clearInterval(screenLock);
        screenLocked = false;
    };
}