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
    self.$container = charConfig.container || document.createElement('span');

    imageConfig = $util.isObject(imageConfig) ? imageConfig : {};
    charConfig = $util.isObject(charConfig) ? charConfig : {};

    // Determines if a character is allowed to be moved with arrow keys
    self.isControllable = charConfig.isControllable || false;

    // Default frame rate for a given character. Controls character speed
    self.charFrameRate = charConfig.frameRate || $const.defaultFrameRate;

    // The default sprite image for a character.
    // If no image is path is passed as an argument this image path is used
    var defaultCharImageSrc = '/img/spritesheet.png';

    // Specifies the dimensions of the character object
    self.$container.height = charConfig.height || 200;
    self.$container.width = charConfig.width || 200;

    // Initializes an image Object
    var charImage = new Image();
    charImage.ready = false;
    charImage.onload = setAssetReady;
    charImage.src = imageConfig.src || defaultCharImageSrc;

    // Character Facing Direction
    var facing = facing || $const.faceLeft;

    var isMoving = false, frameHandle = null;

    function setAssetReady() {
        this.ready = true;
    }

    // Makes the current character moveable by the user
    self.enableControl = function() {
        document.addEventListener($const.keyDown, self.move, false);
        document.addEventListener($const.keyUp, self.move, false);
    };

    // Disables character control for the user
    self.disableControl = function() {
        document.removeEventListener($const.keyDown, self.move);
        document.removeEventListener($const.keyUp, self.move);
    };

    // Move a character in a certain direction
    self.move = function(event) {

        if (event.keyCode === $const.arrowDown) {
            isMoving = (event.type === $const.keyDown);
            facing = $const.faceDown;
        } else if (event.keyCode === $const.arrowLeft) {
            isMoving = (event.type === $const.keyDown);
            facing = $const.faceLeft;
        } else if (event.keyCode === $const.arrowRight) {
            isMoving = (event.type === $const.keyDown);
            facing = $const.faceRight;
        } else if (event.keyCode === $const.arrowUp) {
            isMoving = (event.type === $const.keyDown);
            facing = $const.faceUp;
        }
    };
    self.ctx = self.$container.getContext('2d');
    // Makes the current Character moveable by a user
    //if (self.isControllable)
    //    self.enableControl();
    //
    //frameHandle = setInterval(function() {
    //
    //    var $parentElement = null;
    //    // Erase image
    //    if (charImage.parentElement) {
    //        $parentElement = charImage.parentElement;
    //        charImage.remove();
    //    }
    //
    //}, self.charFrameRate);
    self.ctx.drawImage(charImage, 0, 0, 200, 200, 200, 200, 200, 200);
    //self.$container.appendChild(charImage);
}