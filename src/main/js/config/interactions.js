/**
 * Created by Chris on 06/16/2016
 *
 * Object of all possible interactions through out the game
 */
define('interactions', ['exports', 'constants', 'http', 'dialogue'], function (interactions, constants, http, dialogue) {

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

    interactions.MAIN_CHARACTER_TALKING_TO_HAROLD = {
        objects: ['main-character', 'harold'],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['space']
        },
        does: function (interact, objects, collision, key) {
            var collided = null, mainCharacter = objects['main-character'], harold = objects['harold'];
            if (collision.exists(harold.id) && key.type === constants.keyDown) {
                var position = {
                    x: harold.trajecting() === constants.right ? harold.x + harold.width : harold.x,
                    y: harold.trajecting() === constants.down ? harold.y + harold.height : harold.y
                }, dimension = {height: harold.height, width: harold.width},
                    direction = harold.trajecting(),
                    range = 5;

                collided = collision.check(position, dimension, direction, range, harold);
                if (collided && collided.collisionId === mainCharacter.id && !harold.isTalking()) {
                    interact.whiteListDisable('MAIN_CHARACTER_TALKING_TO_HAROLD');
                    harold.talk('Hello, there! My name is Harold!');
                }
                else if (collided && collided.collisionId === mainCharacter.id && harold.isTalking()) {
                    interact.enableAll();
                    harold.quiet();
                }
            }
        }
    };

    interactions.MAIN_CHARACTER_CONVERSATION_WITH_MR_REE = {
        objects: ['main-character', 'mr-ree', {id: 'mc_conversation_with_mr', object: new dialogue.conversation()}],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['space']
        },
        does: function (interact, objects, collision, key) {
            var collided, mainCharacter = objects['main-character'], mrRee = objects['mr-ree'],
                conversation = objects['mc_conversation_with_mr'],
                position = {
                    x: mainCharacter.trajecting() === constants.right ? mainCharacter.x + mainCharacter.width : mainCharacter.x,
                    y: mainCharacter.trajecting() === constants.down ? mainCharacter.y + mainCharacter.height : mainCharacter.y
                }, dimension = {height: mainCharacter.height, width: mainCharacter.width},
                direction = mainCharacter.trajecting();
            collided = collision.exists(mrRee.id) ? collision.check(position, dimension, direction, 5, mainCharacter) : false;
            if (!conversation.conversing() && key.type === constants.keyDown && collided && collided.collisionId === mrRee.id) {
                interact.whiteListDisable('MAIN_CHARACTER_CONVERSATION_WITH_MR_REE');
                http.get({
                    url: '/defrag-content/conversations/main_character_and_mr_ree_dialogue.json',
                    onSuccess: function (response) {
                        conversation.converse([mainCharacter, mrRee], JSON.parse(response));
                        conversation.next();
                    }
                });
            }
            else if (key.type === constants.keyDown && conversation.conversing()) {
                conversation.next();
                if (!conversation.conversing()) {
                    interact.blackListEnable('MAIN_CHARACTER_CONVERSATION_WITH_MR_REE')
                }
            }
        }
    };

    interactions.MAIN_CHARACTER_SPEED_UP = {
        objects: ['main-character'],
        type: constants.keyPress,
        active: true,
        config: {
            keys: ['shift']
        },
        does: function (interact, objects, collision, key) {
            var object = objects['main-character'];
            if (key.type === constants.keyDown) {
                object.setFrameRate(25);
            }
            else if (key.type === constants.keyUp) {
                object.setFrameRate(100);
            }
        }
    };
});