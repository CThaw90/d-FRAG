/**
 * Created by christhaw on 11/20/15.
 */
function Object(config) {

    var self = this,
        collision = config.cd,
        sprite, frameHandle, image;

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

    if (sprite.src) {
        image = new Image();
        image.src = sprite.src;
        image.height = config.height;
        image.width = config.width;
        image.onload = function() {
            self.ctx.drawImage(
                this, sprite.x || 0, sprite.y || 0,
                sprite['width'], sprite['height'],
                0, 0,
                config.width, config.height
            );
        }
    } else if (sprite.object) {
        image = sprite.object;
        self.ctx.drawImage(
            image, sprite.x || 0, sprite.y || 0,
            sprite['width'], sprite['height'],
            0, 0,
            config.width, config.height
        );
    }

    // Binds the image to the container canvas
    self.$container.appendChild(image);

    self.frameRate = 100;// config.frameRate || _const.defaultFrameRate;

    self.animate = function(animation) {
        self.block = animation.block;
        self.animation = animation;
        self.animationIndex = 0;
    };

    self.activate = function() {
        frameHandle = setInterval(_reloadObjectState, self.frameRate);
        resize();

        if (config.canCollide) {
            collision.add(this);
        }
    };

    self.deactivate = function (timeout) {
        clearInterval(frameHandle);
        if (timeout) {
            setTimeout(function() {
                self.activate();
            }, timeout);
        }
    };

    self.move = function (direction, range) {

        switch (direction) {

            case _const.right:
                self.x += range;
                break;

            case _const.down:
                self.y += range;
                break;

            case _const.left:
                self.y -= range;
                break;

            case _const.up:
                self.x -= range;
                break;

            default:
                break;
        }

        if (!self.animation) {
            self.ctx.drawImage(
                image, sprite.x || 0, sprite.y || 0,
                sprite['width'], sprite['height'],
                0, 0,
                config.width, config.height
            );
        }
    };

    function _reloadObjectState() {

        if (_util.isObject(self.animation)) {

            // Clear Canvas
            self.ctx.clearRect(
                0, 0,
                self.$container.width,
                self.$container.height
            );

            // Store the object animation vector in a temporary object
            var oav = sprite['animationVector'][self.animation.name];


            self.$container.style.left = self.x + 'px';
            self.$container.style.top = self.y + 'px';

            // Redraw the image unto the canvas
            self.$container.height = sprite['height'];
            self.$container.width = sprite['width'];
            if (sprite.hasOwnProperty('width') && sprite.hasOwnProperty('height')) {
                self.ctx.drawImage(
                    image, oav[self.animationIndex].x, oav[self.animationIndex].y,
                    sprite['width'], sprite['height'],
                    0, 0,
                    self.$container.width, self.$container.height
                );
            }

            if (self.animation.type === 'iterate') {

                if (self.animationIndex + 1 < oav.length) {
                    self.animationIndex++;
                } else {
                    self.flag = self.animation.flag;
                    self.animation = undefined;
                    self.block = false;
                }

            } else if (self.animation.type === 'loop') {

            }
        }
    }

    function resize() {
        var bounds = self.$container.getBoundingClientRect();
        self.height = bounds.height;
        self.width = bounds.width;
        self.x = bounds.left;
        self.y = bounds.top;
    }
}