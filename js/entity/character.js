/**
 * Created by christhaw on 10/5/15.
 */

/**
 * @description A function that controls a character sprite and
 * represents a Character object on a playing stage
 * @param config controls the basic configuration settings for the current Character object
 * @param sprite controls the sprite image configuration settings for the current Character
 * @constructor
 */
function Character(config) {

    // Save the Character object to the variable self
    var self = this,
        collision = config.cd,
        sprite;

    // The Html Element container the character object will be held in
    self.$container = config.container || document.createElement('canvas');

    // Captures the context of the character canvas
    self.ctx = self.$container.getContext('2d');

    self.animationIndex = 0;

    sprite = _util.isObject(config.sprite) ? config.sprite : {};
    config = _util.isObject(config) ? config : {};

    // Determines if a character is allowed to be moved with arrow keys
    self.isControllable = config.isControllable || false;

    // Default frame rate for a given character. Controls character speed
    self.frameRate = config.frameRate || _const.defaultFrameRate;

    // The default sprite image for a character.
    // If no image is path is passed as an argument this image path is used
    // var defaultCharImageSrc = '/img/spritesheet.png';

    self.id = config.id;

    // Specifies the dimensions of the character object
    self.$container.height = config.height || 200;
    self.$container.width = config.width || 200;

    // Sets an id for the character object container for arbitrary reference
    self.$container.setAttribute('id', (config.id || 'character-xzf'));

    // Sets the specified position of the character object
    self.position = config.position || {left: 0, top: 0};

    // Applies position coordinates to parent container
    self.$container.style.left = self.position.left+'px';
    self.$container.style.top = self.position.top+'px';
    self.$container.style.position = 'absolute';

    self.height = config.height;
    self.width = config.width;

    // Initializes an image Object
    var charImage = null;
    if (sprite.src) {
        charImage = new Image();
        charImage.src = sprite.src;
        charImage.height = 700;
        charImage.width = 700;
        charImage.onload = function() {
            self.ctx.drawImage(
                this, 0, 0,
                sprite['sectionWidth'], sprite['sectionHeight'],
                0, 0,
                config.width, config.height
            );
        };
    } else if (sprite.object) {
        charImage = sprite.object;
        self.ctx.drawImage(
            charImage, 0, 0,
            sprite['sectionWidth'], sprite['sectionHeight'],
            0, 0,
            config.width, config.height
        );
    }

    // Binds the character image to the container canvas
    self.$container.appendChild(charImage);

    // Character Facing Direction
    var facing = _const.faceLeft,

        direction = {left: false, right: false, up: false, down: false},

        frameHandle = null;

    // Makes the current character moveable by the user
    self.enableControl = function() {
        document.addEventListener(_const.keyDown, self.move, false);
        document.addEventListener(_const.keyUp, self.move, false);
    };

    // Disables character control for the user
    self.disableControl = function() {
        document.removeEventListener(_const.keyDown, self.move);
        document.removeEventListener(_const.keyUp, self.move);
    };

    // Move a character in a certain direction
    self.move = function(event) {
        var keyPressed = (event.type === _const.keyDown);
        if (self.isMoving() && keyPressed) return;

        if (event.keyCode === _const.arrowDown) {
            direction.down = keyPressed;
            facing = direction.down ? _const.faceDown : facing;
        }
        else if (event.keyCode === _const.arrowLeft) {
            direction.left = keyPressed;
            facing = direction.left ? _const.faceLeft : facing;
        }
        else if (event.keyCode === _const.arrowRight) {
            direction.right = keyPressed;
            facing = direction.right ? _const.faceRight : facing;
        }
        else if (event.keyCode === _const.arrowUp) {
            direction.up = keyPressed;
            facing = direction.up ? _const.faceUp : facing;
        }
    };

    self.isMoving = function () {
        return direction.left ||
            direction.right ||
            direction.up ||
            direction.down;
    };

    self.activate = function () {
        frameHandle = setInterval(_reloadObjectState, self.frameRate);
        self.enableControl();
    };

    self.deactivate = function(timeout) {
        clearInterval(frameHandle);
        self.disableControl();
        if (timeout) {
            setTimeout(function() {
                self.enableControl();
                self.activate();
            }, timeout);
        }
    };

    function _reloadObjectState() {

        // Clear Canvas
        self.ctx.clearRect(
            0, 0,
            self.$container.width,
            self.$container.height
        );

        // Store the character animation vector in a temporary object
        var cav = sprite['animationVector']['animate-moving'+facing],
            position = {
                x: facing === _const.faceRight ? (self.position.left + self.$container.width) : self.position.left,
                y: facing === _const.faceDown ? (self.position.top + self.$container.height) : self.position.top
            },
            dimension = {height: self.height, width: self.width};
        if (self.isMoving() /*&& !collision.check(position, facing, config.speed) */) {
            self.animationIndex = self.animationIndex < cav.length - 1 ? self.animationIndex+1 : 0;
            if (direction.down && !collision.check(position, dimension, _const.faceDown, config.speed)) {
                self.position.top += config.speed;
            }
            else if (direction.left && !collision.check(position, dimension, _const.faceLeft, config.speed)) {
                self.position.left -= config.speed;
            }
            else if (direction.up && !collision.check(position, dimension, _const.faceUp, config.speed)) {
                self.position.top -= config.speed;
            }
            else if (direction.right && !collision.check(position, dimension, _const.faceRight, config.speed)) {
                self.position.left += config.speed;
            }
        }

        self.$container.style.left = self.position.left + 'px';
        self.$container.style.top = self.position.top + 'px';

        // Redraw the image unto the canvas
        //sprite.sectionHeight = cav[self.animationIndex]['height'];
        //sprite.sectionWidth = cav[self.animationIndex]['width'];
        self.$container.height = sprite['sectionHeight'];
        self.$container.width = sprite['sectionWidth'];
        if (sprite.hasOwnProperty('sectionWidth') && sprite.hasOwnProperty('sectionHeight')) {
            self.ctx.drawImage(
                charImage, cav[self.animationIndex].x, cav[self.animationIndex].y,
                sprite['sectionWidth'], sprite['sectionHeight'],
                0, 0,
                self.$container.width, self.$container.height
            );
        } else {
            console.error('[Character Object Error]: SectionWidth or SectionHeight property missing');
        }
    }
}