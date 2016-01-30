/**
 * Created by christhaw on 1/10/16.
 */
var withInteractions = [
    {
        id: 'interact_with_steel-door',
        object: 'steel-door',
        trigger: 'character',
        type: _const.movement,
        config: {},
        // Use Photo shop to make pictures bigger without losing pixel
        // quality to match the size of the character sprite
        does: function(object, trigger, collision) {
            var collided = null;
            if (collision.exists(object.id)) {
                var position = {
                    x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === _const.down ? trigger.y + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(),
                    range = 5;

                collided = collision.check(position, dimension, direction, range, trigger);
                if (collided && collided.collisionId === object.id && (!object.flag || object.flag === 'closed') && !object.block) {
                    object['animate']({name: 'animateOpen', type: 'iterate', flag: 'open', block: true});
                }
                else if (object.flag === 'open' && !object.block) {
                    object['animate']({name: 'animateClosed', type: 'iterate', flag: 'closed', block: true});
                }
            }
        }
    },
    {
        id: 'interact_with_black-door',
        object: 'black-door',
        trigger: 'player-two',
        type: _const.keyPress,
        config: {
            keys: ['space']
        },
        does: function(object, trigger, collision, key) {
            var collided = null;
            if (collision.exists(object.id) && key.type === _const.keyDown) {
                var position = {
                    x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === _const.down ? trigger.x + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(),
                    range = 5;

                collided = collision.check(position, dimension, direction, range, trigger);
                if (collided && collided.collisionId === object.id && (!object.flag || object.flag === 'closed') && !object.block) {
                    object['animate']({name: 'animateOpen', type: 'iterate', flag: 'open', block: true});
                }
                else if (collided && collided.collisionId === object.id && object.flag === 'open' && !object.block) {
                    object['animate']({name: 'animateClosed', type: 'iterate', flag: 'closed', block: true});
                }
            }
        }
    },
    {
        id: 'interact_with_player-two',
        object: 'player-two',
        trigger: 'player-two',
        type: _const.keyPress,
        config: {
            keys: ['w', 'a', 's', 'd']
        },
        does: function(object, trigger, collision, key) {

            if (key.type === _const.keyDown) {

                if (key.which === _const.keyMap['d'] && !object.block) {
                    object['animate']({name: 'animate-movingRight', type: 'loop', block: true});
                    object['traject'](_const.right, 5, true);
                }
                else if (key.which === _const.keyMap['w'] && !object.block) {
                    object['animate']({name: 'animate-movingUp', type: 'loop', block: true});
                    object['traject'](_const.up, 5, true);
                }
                else if (key.which === _const.keyMap['a'] && !object.block) {
                    object['animate']({name: 'animate-movingLeft', type: 'loop', block: true});
                    object['traject'](_const.left, 5, true);
                }
                else if (key.which === _const.keyMap['s'] && !object.block) {
                    object['animate']({name: 'animate-movingDown', type: 'loop', block: true});
                    object['traject'](_const.down, 5, true);
                }
                else if (key.which === _const.keyMap['space']) {
                    if (!object.block) {
                        object['animate']({name: 'animate-movingDown', type: 'loop', block: true});
                    } else {
                        object['stopAnimation']();
                    }

                }
            }
            else if (key.type === _const.keyUp && object.block) {

                switch (key.which) {
                    case _const.keyMap['d']:
                    case _const.keyMap['w']:
                    case _const.keyMap['a']:
                    case _const.keyMap['s']:
                        object['stopAnimation']();
                        object['stop']();
                        break;
                }
            }
        }
    },
    {
        id: 'interact_with_character',
        object: 'character',
        trigger: 'character',
        type: _const.keyPress,
        config: {
            keys: ['leftArrow', 'upArrow', 'rightArrow', 'downArrow']
        },
        does: function(object, trigger, collision, key) {

            if (key.type === _const.keyDown && !object.block) {

                switch (key.which) {
                    case _const.keyMap['rightArrow']:
                        object['animate']({name: 'animate-movingRight', type: 'loop', block: true});
                        object['traject'](_const.right, 5, true);
                        break;

                    case _const.keyMap['upArrow']:
                        object['animate']({name: 'animate-movingUp', type: 'loop', block: true});
                        object['traject'](_const.up, 5, true);
                        break;

                    case _const.keyMap['leftArrow']:
                        object['animate']({name: 'animate-movingLeft', type: 'loop', block: true});
                        object['traject'](_const.left, 5, true);
                        break;
                    case _const.keyMap['downArrow']:
                        object['animate']({name: 'animate-movingDown', type: 'loop', block: true});
                        object['traject'](_const.down, 5, true);
                        break;
                }
            }
            else if (key.type === _const.keyUp && object.block) {

                switch (key.which) {
                    case _const.keyMap['leftArrow']:
                    case _const.keyMap['upArrow']:
                    case _const.keyMap['rightArrow']:
                    case _const.keyMap['downArrow']:
                        object['stopAnimation']();
                        object['stop']();
                        break;
                }
            }
        }
    },
    {
        id: 'interaction_between_character_and_talking-character',
        object: 'talking-character',
        trigger: 'character',
        objects: [], // TODO: Make an array of objects accessible to the does function
        type: _const.keyPress,
        config: {
            keys: ['space']
        },
        does: function(object, trigger, collision, key) {
            var collided = null;
            if (collision.exists(object.id) && key.type === _const.keyDown) {
                var position = {
                        x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                        y: trigger.trajecting() === _const.down ? trigger.x + trigger.height : trigger.y
                    }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(),
                    range = 5;

                collided = collision.check(position, dimension, direction, range, trigger);
                if (collided && collided.collisionId === object.id && !object['isTalking']()) {
                    object['talk']('Hello, there! I have learned to Talk!');
                }
                else if (collided && collided.collisionId === object.id && object['isTalking']()) {
                    object['quiet']();
                }
            }
        }
    }
];
var withObjects = {
    stage: {
        backgroundImage: _const.basePath + 'img/stages/grass.png',
        id: 'main-stage',
        objects: [
            {load: _const.basePath + 'json/sprites/trees/tree_a.json', id: 'tree_a'},
            {load: _const.basePath + 'json/sprites/trees/tree_b.json', id: 'tree_b'},
            {load: _const.basePath + 'json/sprites/trees/tree_c.json', id: 'tree_c'},
            {load: _const.basePath + 'json/sprites/trees/tree_d.json', id: 'tree_d'},
            {load: _const.basePath + 'json/sprites/trees/tree_e.json', id: 'tree_e'},
            {load: _const.basePath + 'json/sprites/trees/tree_f.json', id: 'tree_f'},
            {load: _const.basePath + 'json/sprites/trees/tree_h.json', id: 'tree_h'},
            {load: _const.basePath + 'json/sprites/trees/tree_i.json', id: 'tree_i'},
            {load: _const.basePath + 'json/sprites/walls/stone-walls_a.json', id: 'stone-walls_a'},
            {load: _const.basePath + 'json/sprites/walls/stone-walls_b.json', id: 'stone-walls_b'},
            {load: _const.basePath + 'json/sprites/doors/steel-door.json', id: 'steel-door'},
            {load: _const.basePath + 'json/sprites/doors/black-door.json', id: 'black-door'},
            {load: _const.basePath + 'json/sprites/characters/character.json', id: 'character'},
            {load: _const.basePath + 'json/sprites/characters/player-two.json', id: 'player-two'},
            {load: _const.basePath + 'json/sprites/characters/talking-character.json', id: 'talking-character'}
        ]
    }
};

