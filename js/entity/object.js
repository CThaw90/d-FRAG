/**
 * Created by christhaw on 11/20/15.
 */
function Object(config) {

    var self = this,
        collision = config.cd,
        sprite;

    // The container holding the object sprite or reference point
    self.$container = document.createElement('canvas');

    // Sets the specified position of the character object
    self.position = config.position || {left: 0, top: 0};

    // Applies position coordinates to parent container
    self.$container.style.left = self.position.left+'px';
    self.$container.style.top = self.position.top+'px';
    self.$container.style.position = 'absolute';

    self.$container.height = config.height;
    self.$container.width = config.width;

    self.height = config.height;
    self.width = config.width;

    // Captures the context of the object canvas
    self.ctx = self.$container.getContext('2d');
    self.animation = config.animation;
    self.animationIndex = 0;


    self.$container.setAttribute('id', config.id);
    self.id = config.id;

    sprite = _util.isObject(config.sprite) ? config.sprite : {};

    self.frameRate = config.frameRate || _const.defaultFrameRate;

    self.setAnimation = function(animation) {
        self.animation = animation;
    };

    self.activate = function() {
        if (config.canCollide) {
            resize();
            collision.add(this);
        }
    };

    function _reloadObjectState() {

        // Clear Canvas
        self.ctx.clearRect(
            0, 0,
            self.$container.width,
            self.$container.height
        );

        // Store the object animation vector in a temporary object
        var cav = sprite['animationVector'][self.animation];
    }

    function resize() {
        var bounds = self.$container.getBoundingClientRect();
        self.height = bounds.height;
        self.width = bounds.width;
        self.x = bounds.left;
        self.y = bounds.top;
    }
}