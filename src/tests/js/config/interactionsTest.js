/**
 * Created by christhaw on 7/31/16.
 */
define(['Squire', 'constants'], function (Squire, constants) {
    /* globals describe, xit, it, beforeEach, jasmine, JSON */
    describe('Interaction configuration module', function () {

        var http, dialogue, object, generic, collision, interact;

        beforeEach(function () {
            interact = jasmine.createSpyObj('interact', ['whiteListDisable', 'blackListEnable', 'enableAll']);
            collision = jasmine.createSpyObj('collision', ['exists', 'check']);
            dialogue = jasmine.createSpyObj('dialogue', ['conversation']);
            generic = jasmine.createSpyObj('generic', ['collision', 'interact']);
            http = jasmine.createSpyObj('http', ['get']);
            object = jasmine.createSpyObj('object', [
                'animate', 'traject', 'stopAnimation', 'stop', 'isMoving', 'setFrameRate', 'talk', 'quiet', 'isTalking'
            ]);
        });

        it('should interact with the main character by moving them', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {
                var interaction = interactions.INTERACT_WITH_MAIN_CHARACTER,
                    configKeys = ['leftArrow', 'upArrow', 'rightArrow', 'downArrow'],
                    key = {which: constants.keyMap.rightArrow, type: constants.keyDown};

                object.isMoving.and.returnValue(false);

                expect(interaction.objects).toEqual(['main-character']);
                expect(interaction.type).toEqual(constants.keyPress);
                expect(interaction.config).toEqual(jasmine.any(Object));
                expect(interaction.config.keys).toEqual(configKeys);

                expect(object.animate).not.toHaveBeenCalled();
                expect(object.traject).not.toHaveBeenCalled();
                expect(object.stopAnimation).not.toHaveBeenCalled();
                expect(object.stop).not.toHaveBeenCalled();
                expect(object.isMoving).not.toHaveBeenCalled();

                interaction.does(generic, {'main-character': object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(1);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingRight', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(1);
                expect(object.traject).toHaveBeenCalledWith(constants.right, 5, true);

                key.which = constants.keyMap.upArrow;
                interaction.does(generic, {'main-character': object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(2);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingUp', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(2);
                expect(object.traject).toHaveBeenCalledWith(constants.up, 5, true);

                key.which = constants.keyMap.leftArrow;
                interaction.does(generic, {'main-character': object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(3);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingLeft', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(3);
                expect(object.traject).toHaveBeenCalledWith(constants.left, 5, true);

                key.which = constants.keyMap.downArrow;
                interaction.does(generic, {'main-character': object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(4);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingDown', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(4);
                expect(object.traject).toHaveBeenCalledWith(constants.down, 5, true);

                object.isMoving.and.returnValue(true);
                interaction.does(generic, {'main-character': object}, generic, key);

                expect(object.stopAnimation).not.toHaveBeenCalledTimes(1);
                expect(object.stopAnimation).not.toHaveBeenCalledWith();
                expect(object.stop).not.toHaveBeenCalledTimes(1);
                expect(object.stop).not.toHaveBeenCalledWith();

                key.type = constants.keyUp;
                interaction.does(generic, {'main-character': object}, generic, key);

                expect(object.stopAnimation).toHaveBeenCalledTimes(1);
                expect(object.stopAnimation).toHaveBeenCalledWith();
                expect(object.stop).toHaveBeenCalledTimes(1);
                expect(object.stop).toHaveBeenCalledWith();

                done();
            });
        });

        it('should interact with character harold by moving him', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {
                var interaction = interactions.INTERACT_WITH_HAROLD,
                    configKeys = ['w', 'a', 's', 'd'],
                    key = {which: constants.keyMap.d, type: constants.keyDown};

                object.isMoving.and.returnValue(false);

                expect(interaction.objects).toEqual(['harold']);
                expect(interaction.type).toEqual(constants.keyPress);
                expect(interaction.config).toEqual(jasmine.any(Object));
                expect(interaction.config.keys).toEqual(configKeys);

                expect(object.animate).not.toHaveBeenCalled();
                expect(object.traject).not.toHaveBeenCalled();
                expect(object.stopAnimation).not.toHaveBeenCalled();
                expect(object.stop).not.toHaveBeenCalled();
                expect(object.isMoving).not.toHaveBeenCalled();

                interaction.does(generic, {harold: object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(1);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingRight', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(1);
                expect(object.traject).toHaveBeenCalledWith(constants.right, 5, true);

                key.which = constants.keyMap.w;
                interaction.does(generic, {harold: object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(2);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingUp', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(2);
                expect(object.traject).toHaveBeenCalledWith(constants.up, 5, true);

                key.which = constants.keyMap.a;
                interaction.does(generic, {harold: object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(3);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingLeft', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(3);
                expect(object.traject).toHaveBeenCalledWith(constants.left, 5, true);

                key.which = constants.keyMap.s;
                interaction.does(generic, {harold: object}, generic, key);

                expect(object.animate).toHaveBeenCalledTimes(4);
                expect(object.animate).toHaveBeenCalledWith({name: 'animate-movingDown', type: 'loop'});
                expect(object.traject).toHaveBeenCalledTimes(4);
                expect(object.traject).toHaveBeenCalledWith(constants.down, 5, true);

                object.isMoving.and.returnValue(true);
                interaction.does(generic, {harold: object}, generic, key);

                expect(object.stopAnimation).not.toHaveBeenCalledTimes(1);
                expect(object.stopAnimation).not.toHaveBeenCalledWith();
                expect(object.stop).not.toHaveBeenCalledTimes(1);
                expect(object.stop).not.toHaveBeenCalledWith();

                key.type = constants.keyUp;
                interaction.does(generic, {harold: object}, generic, key);

                expect(object.stopAnimation).toHaveBeenCalledTimes(1);
                expect(object.stopAnimation).toHaveBeenCalledWith();
                expect(object.stop).toHaveBeenCalledTimes(1);
                expect(object.stop).toHaveBeenCalledWith();

                done();
            });
        });

        it('should interact main character with the steel door by opening and closing', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {
                var interaction = interactions.INTERACT_MAIN_CHARACTER_WITH_STEEL_DOOR,
                    objects = ['steel-door', 'main-character'],
                    trigger = {
                        trajecting: function () {
                            return constants.right;
                        },
                        height: 200,
                        width: 100,
                        x: 150,
                        y: 50
                    };

                expect(interaction.objects).toEqual(objects);
                expect(interaction.type).toEqual(constants.movement);
                expect(interaction.trigger).toEqual('main-character');

                collision.exists.and.returnValue(false);
                collision.check.and.returnValue({collisionId: 'steel-door'});

                interaction.does(generic, trigger, {'steel-door': object}, collision);

                expect(collision.exists).toHaveBeenCalledTimes(1);
                expect(collision.check).not.toHaveBeenCalled();
                expect(object.animate).not.toHaveBeenCalled();

                object.id = 'steel-door';
                collision.exists.and.returnValue(true);
                interaction.does(generic, trigger, {'steel-door': object}, collision);

                expect(collision.exists).toHaveBeenCalledTimes(2);
                expect(collision.check).toHaveBeenCalledTimes(1);
                expect(collision.check).toHaveBeenCalledWith({x: 250, y: 50}, {height: 200, width: 100}, constants.right, 5, trigger);
                expect(object.animate).toHaveBeenCalledWith({name: 'animateOpen', type: 'iterate', flag: 'open'});
                expect(object.animate).toHaveBeenCalledTimes(1);

                object.flag = 'open';
                trigger.trajecting = function () {return constants.down;};
                interaction.does(generic, trigger, {'steel-door': object}, collision);

                expect(collision.exists).toHaveBeenCalledTimes(3);
                expect(collision.check).toHaveBeenCalledTimes(2);
                expect(collision.check).toHaveBeenCalledWith({x: 150, y: 250}, {height: 200, width: 100}, constants.down, 5, trigger);
                expect(object.animate).toHaveBeenCalledWith({name: 'animateClosed', type: 'iterate', flag: 'closed'});

                done();
            });
        });

        it('should interact main character with the black door by opening and closing with space bar', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {
                var interaction = interactions.INTERACT_MAIN_CHARACTER_WITH_BLACK_DOOR,
                    objects = ['black-door', 'main-character'],
                    configKeys = ['space'],
                    key = {which: constants.keyMap.space, type: constants.keyUp},
                    trigger = {
                        trajecting: function () {return constants.up;},
                        height: 400,
                        width: 200,
                        y: 300,
                        x: 100
                    };

                expect(interaction.objects).toEqual(objects);
                expect(interaction.type).toEqual(constants.keyPress);
                expect(interaction.config).toEqual(jasmine.any(Object));
                expect(interaction.config.keys).toEqual(configKeys);

                object.id = 'black-door';
                collision.exists.and.returnValue(true);
                interaction.does(generic, {'black-door': object, 'main-character': trigger}, collision, key);

                expect(collision.exists).toHaveBeenCalledTimes(1);
                expect(collision.exists).toHaveBeenCalledWith('black-door');

                expect(collision.check).not.toHaveBeenCalled();
                expect(object.animate).not.toHaveBeenCalled();

                key.type = constants.keyDown;
                collision.check.and.returnValue({collisionId: 'black-door'});
                interaction.does(generic, {'black-door': object, 'main-character': trigger}, collision, key);

                expect(collision.exists).toHaveBeenCalledTimes(2);
                expect(collision.exists).not.toHaveBeenCalledWith('main-character');
                expect(collision.check).toHaveBeenCalledTimes(1);
                expect(collision.check).toHaveBeenCalledWith({x: 100, y: 300}, {height: 400, width: 200}, 'up', 5, trigger);
                expect(object.animate).toHaveBeenCalledTimes(1);
                expect(object.animate).toHaveBeenCalledWith({name: 'animateOpen', type: 'iterate', flag: 'open'});

                object.flag = 'open';
                interaction.does(generic, {'black-door': object, 'main-character': trigger}, collision, key);
                expect(collision.exists).toHaveBeenCalledTimes(3);
                expect(collision.check).toHaveBeenCalledTimes(2);
                expect(object.animate).toHaveBeenCalledTimes(2);
                expect(object.animate).toHaveBeenCalledWith({name: 'animateClosed', type: 'iterate', flag: 'closed'});

                done();
            });
        });

        it('should interact main character with harold enabling him to speak', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {
                var interaction = interactions.MAIN_CHARACTER_TALKING_TO_HAROLD,
                    objectIds = ['main-character', 'harold'],
                    configKeys = ['space'],
                    key = {which: constants.keyMap.space, type: constants.keyDown},
                    mainCharacter = {
                        id: 'main-character',
                        height: 400,
                        width: 300,
                        y: 200,
                        x: 100
                    },
                    objects = {
                        'main-character': mainCharacter,
                        harold: object
                    };

                expect(interaction.objects).toEqual(objectIds);
                expect(interaction.type).toEqual(constants.keyPress);
                expect(interaction.config).toEqual(jasmine.any(Object));
                expect(interaction.config.keys).toEqual(configKeys);

                collision.exists.and.returnValue(false);
                interaction.does(interact, objects, collision, key);

                expect(collision.check).not.toHaveBeenCalled();
                expect(object.isTalking).not.toHaveBeenCalled();
                expect(interact.whiteListDisable).not.toHaveBeenCalled();
                expect(object.talk).not.toHaveBeenCalled();
                expect(interact.enableAll).not.toHaveBeenCalled();
                expect(object.quiet).not.toHaveBeenCalled();

                object.trajecting = function () {
                    return constants.right;
                };
                object.id = 'harold';
                object.height = 100;
                object.width = 200;
                object.y = 300;
                object.x = 400;
                object.isTalking.and.returnValue(false);
                collision.exists.and.returnValue(true);
                collision.check.and.returnValue({collisionId: mainCharacter.id});
                interaction.does(interact, objects, collision, key);

                expect(collision.check).toHaveBeenCalledTimes(1);
                expect(collision.check).toHaveBeenCalledWith({x: 600, y: 300}, {height: 100, width: 200}, 'right', 5, object);
                expect(interact.whiteListDisable).toHaveBeenCalledWith('MAIN_CHARACTER_TALKING_TO_HAROLD');
                expect(object.talk).toHaveBeenCalledWith('Hello, there! My name is Harold!');

                object.isTalking.and.returnValue(true);
                interaction.does(interact, objects, collision, key);
                
                expect(interact.enableAll).toHaveBeenCalledTimes(1);
                expect(object.quiet).toHaveBeenCalledTimes(1);

                done();
            });
        });

        it('should interact main character with mr-ree enabling them to have a conversation', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {
                var interaction = interactions.MAIN_CHARACTER_CONVERSATION_WITH_MR_REE,
                    objectIds = ['main-character', 'mr-ree', {
                        id: 'mc_conversation_with_mr',
                        object: jasmine.any(Object)
                    }],
                    configKeys = ['space'],
                    conversation = jasmine.createSpyObj('conversation', ['conversing', 'next', 'converse']),
                    key = {which: constants.keyMap.space, type: constants.keyDown},
                    json = {id: 'conversation_with_mr_ree', conversation: 'starting', responder: 'main-character'},
                    mainCharacter = {
                        trajecting: function () {
                            return constants.right;
                        },
                        height: 100,
                        width: 200,
                        y: 300,
                        x: 400
                    },
                    mrRee = {
                        id: 'mr-ree',
                        height: 100,
                        width: 200,
                        y: 300,
                        x: 400
                    },
                    objects = {
                        'mc_conversation_with_mr': conversation,
                        'main-character': mainCharacter,
                        'mr-ree': mrRee
                    };

                expect(interaction.objects).toEqual(objectIds);
                expect(interaction.type).toEqual(constants.keyPress);
                expect(interaction.config).toEqual(jasmine.any(Object));
                expect(interaction.config.keys).toEqual(configKeys);

                collision.exists.and.returnValue(false);
                conversation.conversing.and.returnValue(false);
                interaction.does(interact, objects, collision, key);

                expect(collision.check).not.toHaveBeenCalled();
                expect(interact.whiteListDisable).not.toHaveBeenCalled();
                expect(interact.blackListEnable).not.toHaveBeenCalled();
                expect(http.get).not.toHaveBeenCalled();
                expect(conversation.conversing).toHaveBeenCalledTimes(2);

                collision.exists.and.returnValue(true);
                collision.check.and.returnValue({collisionId: mrRee.id});
                http.get.and.callFake(function (config) {
                    expect(config.url).toEqual('/defrag-content/conversations/main_character_and_mr_ree_dialogue.json');
                    expect(config.onSuccess).toEqual(jasmine.any(Function));
                    config.onSuccess(JSON.stringify(json));

                    expect(conversation.converse).toHaveBeenCalledWith([mainCharacter, mrRee], json);
                    expect(conversation.next).toHaveBeenCalledTimes(1);
                });

                interaction.does(interact, objects, collision, key);

                expect(collision.check).toHaveBeenCalledTimes(1);
                expect(collision.check).toHaveBeenCalledWith({x: 600, y: 300},
                    {height: 100, width: 200}, constants.right, 5, mainCharacter);
                expect(conversation.conversing).toHaveBeenCalledTimes(3);
                expect(interact.whiteListDisable).toHaveBeenCalledTimes(1);
                expect(http.get).toHaveBeenCalledTimes(1);

                conversation.conversing.and.returnValue(true);
                interaction.does(interact, objects, collision, key);

                expect(conversation.next).toHaveBeenCalledTimes(2);
                expect(conversation.conversing).toHaveBeenCalledTimes(6);
                expect(interact.blackListEnable).not.toHaveBeenCalled();
                var calls = 0;
                conversation.conversing.and.callFake(function () {
                    return calls++ < 2;
                });
                interaction.does(interact, objects, collision, key);

                expect(conversation.next).toHaveBeenCalledTimes(3);
                expect(conversation.conversing).toHaveBeenCalledTimes(9);
                expect(interact.blackListEnable).toHaveBeenCalledTimes(1);
                expect(interact.blackListEnable).toHaveBeenCalledWith('MAIN_CHARACTER_CONVERSATION_WITH_MR_REE');

                done();
            });
        });

        it('should interact with main character and speed up when the shift button is pressed', function (done) {
            var injector = new Squire();
            injector.mock({
                dialogue: dialogue,
                http: http
            }).require(['interactions'], function (interactions) {

                var interaction = interactions.MAIN_CHARACTER_SPEED_UP,
                    objects = ['main-character'],
                    key = {type: constants.keyDown},
                    configKeys = ['shift'];

                expect(interaction.objects).toEqual(objects);
                expect(interaction.type).toEqual(constants.keyPress);
                expect(interaction.config).toEqual(jasmine.any(Object));
                expect(interaction.config.keys).toEqual(configKeys);

                interaction.does(generic, {'main-character': object}, collision, key);
                expect(object.setFrameRate).toHaveBeenCalledTimes(1);
                expect(object.setFrameRate).toHaveBeenCalledWith(25);
                expect(object.setFrameRate).not.toHaveBeenCalledWith(100);

                key.type = constants.keyUp;
                interaction.does(generic, {'main-character': object}, collision, key);
                expect(object.setFrameRate).toHaveBeenCalledTimes(2);
                expect(object.setFrameRate).toHaveBeenCalledWith(100);

                done();
            });
        });
    });
});