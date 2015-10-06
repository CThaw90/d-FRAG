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
function Character(charImageParams, facing, isMoveable, charFrameRate) {

    // Save the Character object to the variable self
    var self = this;

    if (!charImageParams.toString() || typeof charImageParams !== 'object')
        charImageParams = {};

    // Determines if a character is allowed to be moved with arrow keys
    self.isMoveable = isMoveable || false;

    // Default frame rate for a given character. Controls character speed
    self.charFrameRate = charFrameRate || CONST.DEFAULT_FRAME_RATE;

    // The default sprite image for a character.
    // If no image is path is passed as an argument this image path is used
    var defaultCharImageSrc = '/img/spritesheet.png';

    // Initializes an image Object
    var charImage = new Image();
    charImage.ready = false;
    charImage.onload = setAssetReady;
    charImage.src = charImageParams.src || defaultCharImageSrc;

    // Character Facing Direction
    var facing = facing || CONST.LEFT;

    var isMoving = false;

    function setAssetReady() {
        this.ready = true;
    }

    // Makes the current character moveable by the user
    self.makeMoveable = function() {
        document.addEventListener("keydown", self.move, false);
        document.addEventListener("keyup", self.move, false);
    };

    // Move a character in a certain direction
    self.move = function(event) {

        switch (event.keyCode) {

            case CONST.ARROW_DOWN:
                isMoving = (event.type === 'keydown');
                facing = CONST.DOWN;
                break;

            case CONST.ARROW_LEFT:
                isMoving = (event.type === 'keydown');
                facing = CONST.LEFT;
                break;

            case CONST.ARROW_RIGHT:
                isMoving = (event.type === 'keydown');
                facing = CONST.RIGHT;
                break;

            case CONST.ARROW_UP:
                isMoving = (event.type === 'keydown');
                facing = CONST.UP;
                break;
        }
    };

    // Makes the current Character moveable by a user
    if (self.isMoveable)
        self.makeMoveable();
}