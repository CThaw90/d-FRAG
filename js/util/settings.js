/**
 * Created by christhaw on 1/10/16.
 */
var withInteractions = [
    {
        id: 'interact_with_tree_a',
        object: 'tree_a',
        trigger: 'main-character',
        type: _const.movement,
        does: function(object, trigger, collision) {
            var collided = null;
            if (collision.exists(object.id)) {
                var position = {
                    x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === _const.down ? trigger.y + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(),
                    range = 5;

                collided = collision.check(position, dimension, direction, range);
                if (collided && collided.collisionId === object.id) {
                    console.log(collided);
                }
            }
        }
    },
    {
        id: 'interact_with_steel-door',
        object: 'steel-door',
        trigger: 'main-character',
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

                collided = collision.check(position, dimension, direction, range);
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
        trigger: 'main-character',
        type: _const.keyPress,
        config: {
            keys: ['shift']
        },
        does: function(object, trigger, collision, key) {
            var collided = null;
            if (collision.exists(object.id)) {
                var position = {
                    x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === _const.down ? trigger.x + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(),
                    range = 5;

                collided = collision.check(position, dimension, direction, range);
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
        id: 'interact_with_character',
        object: 'character',
        trigger: 'character',
        type: _const.keyPress,
        config: {
            keys: ['w', 'a', 's', 'd']
        },
        does: function(object, trigger, collision, key) {
            console.log('Interaction!' + key.which + ' ?= ' + _const.keyMap['d']);

            if (key.which === _const.keyMap['d']) {
                object.move(_const.right, 5);
            }
            else if (key.which === _const.keyMap['w']) {

            }
            else if (key.which === _const.keyMap['s']) {

            }
            else if (key.which === _const.keyMap['a']) {

            }
        }
    }
];
var withObjects = {
    mainCharacter: {
        sprite: _const.basePath + 'json/sprites/main-character.json',
        id: 'main-character'
    },
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
            {load: _const.basePath + 'json/sprites/characters/character.json', id: 'character'}
        ]
    }
};

