/**
 * Created by christhaw on 10/5/15.
 */

/**
 * @description A function that controls a character sprite and
 * represents a Character object on a playing stage
 * @param charConfig controls the basic configuration settings for the current Character object
 * @param imageConfig controls the sprite image configuration settings for the current Character
 * @constructor
 */
function Character(charConfig, imageConfig) {

    // Save the Character object to the variable self
    var self = this;

    // The Html Element container the character object will be held in
    self.$container = charConfig.container || document.createElement('canvas');

    // Captures the context of the character canvas
    self.ctx = self.$container.getContext('2d');

    self.animationIndex = 0;

    imageConfig = _util.isObject(imageConfig) ? imageConfig : {};
    charConfig = _util.isObject(charConfig) ? charConfig : {};

    // Determines if a character is allowed to be moved with arrow keys
    self.isControllable = charConfig.isControllable || false;

    // Default frame rate for a given character. Controls character speed
    self.charFrameRate = charConfig.frameRate || _const.defaultFrameRate;

    // The default sprite image for a character.
    // If no image is path is passed as an argument this image path is used
    var defaultCharImageSrc = '/img/spritesheet.png';

    // Specifies the dimensions of the character object
    self.$container.height = charConfig.height || 200;
    self.$container.width = charConfig.width || 200;

    // Sets an id for the character object container for arbitrary reference
    self.$container.setAttribute('id', (charConfig.id || 'character-xzf'));

    // Sets the specified position of the character object
    self.position = charConfig.position || {left: 0, top: 0};

    // Applies position coordinates to parent container
    self.$container.style.left = self.position.left+'px';
    self.$container.style.top = self.position.top+'px';
    self.$container.style.position = 'absolute';

    // Initializes an image Object
    var charImage = new Image();
    charImage.ready = false;
    charImage.src = imageConfig.src || defaultCharImageSrc;
    charImage.height = 700;
    charImage.width = 700;
    charImage.onload = function() {
        self.ctx.drawImage(
            this, 0, 0,
            imageConfig.sectionWidth, imageConfig.sectionHeight,
            0, 0,
            charConfig.width, charConfig.height
        );
    };

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
        if (event.keyCode === _const.arrowDown) {
            direction.down = keyPressed;
            facing = direction.down ? _const.faceDown : facing;

        }
        if (event.keyCode === _const.arrowLeft) {
            direction.left = keyPressed;
            facing = direction.left ? _const.faceLeft : facing;

        }
        if (event.keyCode === _const.arrowRight) {
            direction.right = keyPressed;
            facing = direction.right ? _const.faceRight : facing;

        }
        if (event.keyCode === _const.arrowUp) {
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
        frameHandle = setInterval(_reloadObjectState, self.charFrameRate);
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
        self.ctx.fillStyle = 'black';
        self.ctx.fillRect(
            0, 0,
            self.$container.width,
            self.$container.height
        );
        // Store the character animation vector in a temporary object
        var cav = imageConfig.animationVector['animate-moving'+facing];
        if (self.isMoving()) {
            self.animationIndex = self.animationIndex < cav.length - 1 ? self.animationIndex+1 : 0;
            if (direction.down) {
                self.position.top += charConfig.speed;
            }
            if (direction.left) {
                self.position.left -= charConfig.speed;
            }
            if (direction.up) {
                self.position.top -= charConfig.speed;
            }
            if (direction.right) {
                self.position.left += charConfig.speed;
            }
        }

        self.$container.style.left = self.position.left + 'px';
        self.$container.style.top = self.position.top + 'px';

        // Redraw the image unto the canvas
        self.ctx.drawImage(
            charImage, cav[self.animationIndex].x, cav[self.animationIndex].y,
            imageConfig.sectionWidth, imageConfig.sectionHeight,
            0, 0,
            charConfig.width, charConfig.height
        );
    }
}