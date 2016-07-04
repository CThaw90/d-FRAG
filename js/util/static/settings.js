/**
 * Created by christhaw on 1/10/16.
 */
var withInteractions = [], withObjects = [], withScenes = [];

_util.waitUntil(_util.domLoaded, [], function() {

    withInteractions = [
        {
            id: 'interact_with_steel-door',
            objects: ['steel-door', 'character'],
            trigger: 'character',
            type: _const.movement,
            active: true,
            // Use Photo shop to make pictures bigger without losing pixel
            // quality to match the size of the character sprite
            does: function(interact, trigger, objects, collision) {
                var collided = null, object = objects['steel-door'];
                if (collision.exists('steel-door')) {
                    var position = {
                            x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                            y: trigger.trajecting() === _const.down ? trigger.y + trigger.height : trigger.y
                        }, dimension = {height: trigger.height, width: trigger.width},
                        direction = trigger.trajecting(), range = 5;

                    collided = collision.check(position, dimension, direction, range, trigger);
                    if (collided && collided.collisionId === object.id && (!object['flag'] || object['flag'] === 'closed') && !object.block) {
                        object['animate']({name: 'animateOpen', type: 'iterate', flag: 'open', block: true});
                    }
                    else if (object['flag'] === 'open' && !object.block) {
                        object['animate']({name: 'animateClosed', type: 'iterate', flag: 'closed', block: true});
                    }
                }
            }
        },
        {
            id: 'interact_with_black-door',
            objects: ['black-door', 'harold'],
            type: _const.keyPress,
            active: true,
            config: {
                keys: ['space']
            },
            does: function(interact, objects, collision, key) {
                var collided = null, object = objects['black-door'], trigger = objects['harold'];
                if (collision.exists(object.id) && key.type === _const.keyDown) {
                    var position = {
                            x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                            y: trigger.trajecting() === _const.down ? trigger.y + trigger.height : trigger.y
                        }, dimension = {height: trigger.height, width: trigger.width},
                        direction = trigger.trajecting(), range = 5;

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
            id: 'interact_with_character',
            objects: ['character'],
            type: _const.keyPress,
            active: true,
            config: {
                keys: ['leftArrow', 'upArrow', 'rightArrow', 'downArrow']
            },
            does: function(interact, objects, collision, key) {
                var object = objects['character'];
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
            id: 'interact_with_harold',
            objects: ['harold'],
            type: _const.keyPress,
            active: true,
            config: {
                keys: ['w', 'a', 's', 'd']
            },
            does: function(interact, objects, collision, key) {
                var object = objects['harold'];
                if (key.type === _const.keyDown && !object.block) {

                    switch (key.which) {
                        case _const.keyMap['d']:
                            object['animate']({name: 'animate-movingRight', type: 'loop', block: true});
                            object['traject'](_const.right, 5, true);
                            break;

                        case _const.keyMap['w']:
                            object['animate']({name: 'animate-movingUp', type: 'loop', block: true});
                            object['traject'](_const.up, 5, true);
                            break;

                        case _const.keyMap['a']:
                            object['animate']({name: 'animate-movingLeft', type: 'loop', block: true});
                            object['traject'](_const.left, 5, true);
                            break;

                        case _const.keyMap['s']:
                            object['animate']({name: 'animate-movingDown', type: 'loop', block: true});
                            object['traject'](_const.down, 5, true);
                            break;
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
            id: 'interaction_between_character_and_talking-character',
            objects: ['character','mr-ree'],
            type: _const.keyPress,
            active: false,
            config: {
                keys: ['space']
            },
            does: function(interact, objects, collision, key) {
                var collided = null, object = objects['mr-ree'], trigger = objects['character'];
                if (collision.exists(object.id) && key.type === _const.keyDown) {
                    var position = {
                            x: trigger.trajecting() === _const.right ? trigger.x + trigger.width : trigger.x,
                            y: trigger.trajecting() === _const.down ? trigger.y + trigger.height : trigger.y
                        }, dimension = {height: trigger.height, width: trigger.width},
                        direction = trigger.trajecting(),
                        range = 5;

                    collided = collision.check(position, dimension, direction, range, trigger);
                    if (collided && collided.collisionId === object.id && !object['isTalking']()) {
                        interact.whiteListDisable('interaction_between_character_and_talking-character');
                        object['talk']('Hello, there! I have learned to Talk!');
                    }
                    else if (collided && collided.collisionId === object.id && object['isTalking']()) {
                        interact.enableAll();
                        object['quiet']();
                    }
                }
            }
        },
        {
            id: 'interaction_between_character_and_mr-ree',
            objects: [
                {id: 'get_dialogue_between_character_and_mr_ree', object: new HttpRequest()},
                {id: 'dialogue_between_character_and_mr_ree', object: new Dialogue()},
                'character', 'mr-ree'
            ],
            type: _const.keyPress,
            active: true,
            config: {
                keys: ['space']
            },
            does: function(interact, objects, collision, key) {
                var collided = null, character = objects['character'], mr_ree = objects['mr-ree'],
                    dialogue = objects['dialogue_between_character_and_mr_ree'],
                    http = objects['get_dialogue_between_character_and_mr_ree'],
                    position = {
                        x: character.trajecting() === _const.right ? character.x + character.width : character.x,
                        y: character.trajecting() === _const.down ? character.y + character.height : character.y
                    }, dimension = {height: character.height, width: character.width},
                    direction = character.trajecting();
                collided = collision.exists(mr_ree.id) ?
                    collision.check(position, dimension, direction, character.range, character) : false;
                if (!dialogue.conversing() && key.type === _const.keyDown && collision.exists(mr_ree.id)) {
                    position = {
                        x: character.trajecting() === _const.right ? character.x + character.width : character.x,
                        y: character.trajecting() === _const.down ? character.y + character.height : character.y
                    }, dimension = {height: character.height, width: character.width},
                        direction = character.trajecting();

                    if (collided && collided.collisionId === mr_ree.id) {
                        interact.whiteListDisable('interaction_between_character_and_mr-ree');
                        http.get({
                            id: 'get_dialogue_between_character_and_mr_ree',
                            url: _const.basePath + 'json/dialogue/character_mr_ree_dialogue.json',
                            onSuccess: function(response) {
                                dialogue.converse([character, mr_ree], JSON.parse(response));
                                dialogue.next();
                            }
                        });
                    }
                }
                else if (key.type === _const.keyDown && dialogue.conversing()) {
                    dialogue.next();
                    if (!dialogue.conversing()) {
                        interact.blackListEnable('interaction_between_character_and_talking-character');
                    }
                }
            }
        },
        {
            id: 'interaction_to_statically_place_mr-lorenzo',
            objects: ['mr-lorenzo'],
            type: _const.keyPress,
            active: true,
            config: {
                keys: ['p']
            },
            does: function(interact, objects, collision, key) {
                objects['mr-lorenzo'].stopAI();
                objects['mr-lorenzo'].place(200, 200);
            }
        }
    ];
    withObjects = {
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
                {load: _const.basePath + 'json/sprites/characters/harold.json', id: 'harold'},
                {load: _const.basePath + 'json/sprites/characters/mr-lorenzo.json', id: 'mr-lorenzo'},
                {load: _const.basePath + 'json/sprites/characters/mr-ree.json', id: 'mr-ree'}
            ],
            scenes: [
                {load: _const.basePath + 'json/scenes/introduction.json', id: 'introduction'}
            ]
        }
    };
}, []);
