/**
 * Created by Chris on 06/16/2016
 *
 * Object of all possible interactions through out the game
 */
define('interactions', ['exports', 'constants'], function (interactions, constants) {

    interactions.INTERACT_WITH_MAIN_CHARACTER = {
        objects: ['character'],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['leftArrow', 'upArrow', 'rightArrow', 'downArrow']
        },
        does: function (interact, objects, collision, key) {
            var object = objects['character'];
            if (key.type === constants.keyDown && !object.block) {

                switch (key.which) {
                    case constants.keyMap.rightArrow:
                        object.animate({name: 'animate-movingRight', type: 'loop', block: true});
                        object.traject(constants.right, 5, true);
                        break;

                    case constants.keyMap.upArrow:
                        object.animate({name: 'animate-movingUp', type: 'loop', block: true});
                        object.traject(constants.up, 5, true);
                        break;

                    case constants.keyMap.leftArrow:
                        object.animate({name: 'animate-movingLeft', type: 'loop', block: true});
                        object.traject(constants.left, 5, true);
                        break;

                    case constants.keyMap.downArrow:
                        object.animate({name: 'animate-movingDown', type: 'loop', block: true});
                        object.traject(constants.down, 5, true);
                        break;
                }
            }
            else if (key.type === constants.keyUp && object.block) {

                switch (key.which) {
                    case constants.keyMap.leftArrow:
                    case constants.keyMap.upArrow:
                    case constants.keyMap.rightArrow:
                    case constants.keyMap.downArrow:
                        object.stopAnimation();
                        object.stop();
                }
            }
        }
    };
});