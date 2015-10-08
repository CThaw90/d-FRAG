/**
 * Created by christhaw on 10/5/15.
 */

/**
 * @description A function that controls a character sprite and
 * represents a Character object on a playing stage
 * @param charImageParams controls the sprite image of a character
 * @param facing determines which direction a character is facing
 * @param isMoveable determines if a character can be controlled by the user
 * @param charFrameRate frame determines how fast a character can move
 * @constructor
 */
function Character(imageConfig, charConfig) {

    // Save the Character object to the variable self
    var self = this;

    imageConfig = $util.isObject(imageConfig) ? imageConfig : {};
    charConfig = $util.isObject(charConfig) ? charConfig : {};

    // Determines if a character is allowed to be moved with arrow keys
    self.isMoveable = charConfig.isMoveable || false;

    // Default frame rate for a given character. Controls character speed
    self.charFrameRate = charConfig.frameRate || $const.defaultFrameRate;

    // The default sprite image for a character.
    // If no image is path is passed as an argument this image path is used
    var defaultCharImageSrc = '/img/spritesheet.png';

    // Initializes an image Object
    var charImage = new Image();
    charImage.ready = false;
    charImage.onload = setAssetReady;
    charImage.src = imageConfig.src || defaultCharImageSrc;

    // Character Facing Direction
    var facing = facing || $const.faceLeft;

    var isMoving = false;

    function setAssetReady() {
        this.ready = true;
    }

    // Makes the current character moveable by the user
    self.makeMoveable = function() {
        document.addEventListener($const.keyDown, self.move, false);
        document.addEventListener($const.keyUp, self.move, false);
    };

    // Move a character in a certain direction
    self.move = function(event) {

        switch (event.keyCode) {

            case $const.arrowDown:
                isMoving = (event.type === $const.keyDown);
                facing = $const.faceDown;
                break;

            case $const.arrowLeft:
                isMoving = (event.type === $const.keyDown);
                facing = $const.faceLeft;
                break;

            case $const.arrowRight:
                isMoving = (event.type === $const.keyDown);
                facing = $const.faceRight;
                break;

            case $const.arrowUp:
                isMoving = (event.type === $const.keyDown);
                facing = $const.faceUp;
                break;
        }
    };

    // Makes the current Character moveable by a user
    if (self.isMoveable)
        self.makeMoveable();
}