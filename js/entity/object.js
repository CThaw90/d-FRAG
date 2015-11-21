/**
 * Created by christhaw on 11/20/15.
 */
function Object(config) {

    var self = this,
        sprite;

    // The container holding the object sprite or reference point
    self.$container = document.createElement('canvas');

    // Captures the context of the object canvas
    self.ctx = self.$container.getContext('2d');
    self.animationIndex = 0;

    sprite = _util.isObject(config.sprite) ? config.sprite : {};

    self.frameRate = config.frameRate || _const.defaultFrameRate;

}