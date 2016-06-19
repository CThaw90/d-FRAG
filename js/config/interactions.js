/**
 * Created by Chris on 06/16/2016
 *
 * Object of all possible interactions through out the game
 */
define('interactions', ['exports', 'constants'], function (interactions, constants) {

    interactions.INTERACT_WITH_MAIN_CHARACTER = {
        objects: ['main-character'],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['leftArrow', 'upArrow', 'rightArrow', 'downArrow']
        },
        does: function (interact, objects, collision, key) {
            var object = objects['main-character'];
            if (key.type === constants.keyDown && !object.isMoving()) {

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
            else if (key.type === constants.keyUp && object.isMoving()) {

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

    interactions.INTERACT_WITH_HAROLD = {
        objects: ['harold'],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['w', 'a', 's', 'd']
        },
        does: function (interact, objects, collision, key) {
            var harold = objects[this.objects[0]];
            if (key.type === constants.keyDown && !harold.isMoving()) {

                switch (key.which) {
                    case constants.keyMap.d:
                        harold.animate({name: 'animate-movingRight', type: 'loop'});
                        harold.traject(constants.right, 5, true);
                        break;

                    case constants.keyMap.w:
                        harold.animate({name: 'animate-movingUp', type: 'loop'});
                        harold.traject(constants.up, 5, true);
                        break;

                    case constants.keyMap.a:
                        harold.animate({name: 'animate-movingLeft', type: 'loop'});
                        harold.traject(constants.left, 5, true);
                        break;

                    case constants.keyMap.s:
                        harold.animate({name: 'animate-movingDown', type: 'loop'});
                        harold.traject(constants.down, 5, true);
                        break;
                }
            }
            else if (key.type === constants.keyUp && harold.isMoving()) {

                switch (key.which) {
                    case constants.keyMap.d:
                    case constants.keyMap.w:
                    case constants.keyMap.a:
                    case constants.keyMap.s:
                        harold.stopAnimation();
                        harold.stop();
                        break;
                }
            }
        }
    };

    interactions.INTERACT_MAIN_CHARACTER_WITH_STEEL_DOOR = {
        objects: ['steel-door', 'main-character'],
        trigger: 'main-character',
        type: constants.movement,
        active: true,
        // Use Photo shop to make pictures bigger without losing pixel
        // quality to match the size of the character sprite
        does: function (interact, trigger, objects, collision) {
            var collided = null, object = objects['steel-door'];
            if (collision.exists('steel-door')) {
                var position = {
                    x: trigger.trajecting() === constants.right ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === constants.down ? trigger.y + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(), range = 5;

                collided = collision.check(position, dimension, direction, range, trigger);
                if (collided && collided.collisionId === object.id && (!object.flag || object.flag === 'closed')) {
                    object.animate({name: 'animateOpen', type: 'iterate', flag: 'open'});
                }
                else if (object.flag === 'open') {
                    object.animate({name: 'animateClosed', type: 'iterate', flag: 'closed'});
                }
            }
        }
    };

    interactions.INTERACT_MAIN_CHARACTER_WITH_BLACK_DOOR = {
        objects: ['black-door', 'main-character'],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['space']
        },
        does: function (interact, objects, collision, key) {
            var collided = null, object = objects['black-door'], trigger = objects['main-character'];
            if (collision.exists(object.id) && key.type === constants.keyDown) {
                var position = {
                    x: trigger.trajecting() === constants.right ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === constants.down ? trigger.y + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(), range = 5;

                collided = collision.check(position, dimension, direction, range, trigger);
                if (collided && collided.collisionId === object.id && (!object.flag || object.flag === 'closed') && trigger.trajecting() === 'up') {
                    object.animate({name: 'animateOpen', type: 'iterate', flag: 'open'});
                }
                else if (collided && collided.collisionId === object.id && object.flag === 'open' && trigger.trajecting() === 'up') {
                    object.animate({name: 'animateClosed', type: 'iterate', flag: 'closed'});
                }
            }
        }
    };
});