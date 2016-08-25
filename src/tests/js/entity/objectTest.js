/**
 * Created by christhaw on 8/17/16.
 */
define(['Squire', 'constants', 'utility'], function (Squire, constants, utility) {
    /* globals describe, xit, it, beforeEach, jasmine, spyOn */
    describe('Object module', function () {

        var collision, dialogue, configuration = getJSONFixture('json/object/config.json');

        beforeEach(function () {
            collision = jasmine.createSpyObj('collision', ['add', 'check', 'remove']);
            dialogue = jasmine.createSpyObj('dialogue', ['box']);

            dialogue.box = function () {};
            dialogue.box.prototype = jasmine.createSpyObj('box', ['show', 'hide', 'isDisplayed']);
            dialogue.box.prototype.show.and.callFake(function () {
                dialogue.box.prototype.isDisplayed.and.returnValue(true);
            });
            dialogue.box.prototype.hide.and.callFake(function () {
                dialogue.box.prototype.isDisplayed.and.returnValue(false);
            });
        });

        it('should create a new valid object entity', function (done) {
            var injector = new Squire();
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
               var entity = new object.Entity({id: 'testingObjectEntity'}), isAFunction = jasmine.any(Function),
                   validObject = {
                       id: 'testingObjectEntity',
                       animate: isAFunction,
                       activate: isAFunction,
                       deactivate: isAFunction,
                       isMoving: isAFunction,
                       isTalking: isAFunction,
                       setFrameRate: isAFunction,
                       move: isAFunction,
                       place: isAFunction,
                       stop: isAFunction,
                       stopAnimation: isAFunction,
                       talk: isAFunction,
                       quiet: isAFunction,
                       trajecting: isAFunction,
                       traject: isAFunction,
                       finishedLoading: isAFunction,
                       returnSelf: isAFunction
                   };

                expect(Object.keys(validObject)).toEqual(Object.keys(entity));
                Object.keys(validObject).forEach(function (key) {
                    expect(entity[key]).toEqual(validObject[key]);
                });
                done();
            });
        });

        it('should create a new valid object entity with configurations', function (done) {
            var injector = new Squire(), FINISHED = true;
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration);
                setTimeout(function () {
                    expect(entity.finishedLoading()).toBe(FINISHED);
                    done();
                }, 100);
                expect(entity.finishedLoading()).not.toBe(FINISHED);
                expect(entity.height).toBe(80);
                expect(entity.width).toBe(50);
                expect(entity.x).toBe(100);
                expect(entity.y).toBe(300);
            });
        });

        it('should not append sprite to the stage parent DOM if invalid html node', function (done) {
            configuration.parent = jasmine.createSpyObj('parent', ['appendChild']);
            var injector = new Squire();
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                new object.Entity(configuration);
                expect(configuration.parent.appendChild).not.toHaveBeenCalled();

                done();
            });
        });

        it('should append sprite to the stage if parent DOM is a valid html node', function (done) {
            configuration.parent = document.createElement('div');
            spyOn(configuration.parent, 'appendChild');
            var injector = new Squire();
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration);
                setTimeout(function () {
                    expect(configuration.parent.appendChild).toHaveBeenCalled();
                    done();
                }, 100);
            });
        });

        it('should add object to the collision vector on activation and kick off reloadable render state', function (done) {
            configuration.parent = document.createElement('canvas');
            spyOn(window, 'setInterval');
            var injector = new Squire();
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration);
                expect(window.setInterval).not.toHaveBeenCalled();
                expect(collision.add).not.toHaveBeenCalled();

                entity.activate();

                expect(collision.add).toHaveBeenCalled();
                expect(window.setInterval).toHaveBeenCalled();
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), 50);
                done();
            });
        });

        it('should stop reloadable state on deactivation', function (done) {
            configuration.parent = document.createElement('div');
            configuration.frameRate = 5;
            var injector = new Squire();
            spyOn(utility, 'isObject');
            injector.mock({
                collision: collision,
                dialogue: dialogue,
                utility: utility
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration);
                expect(utility.isObject).toHaveBeenCalledTimes(1);
                entity.activate();
                setTimeout(function () {
                    expect(utility.isObject).toHaveBeenCalledTimes(4);
                    entity.deactivate();
                }, 19);
                setTimeout(function () {
                    expect(utility.isObject).toHaveBeenCalledTimes(4);
                    done();
                }, 39);
            });
        });

        it('should stop reloadable state and restart after specified timeout', function (done) {
            var injector = new Squire(), utilSpy = jasmine.createSpyObj('utility', ['isObject']);
            configuration.parent = document.createElement('div');
            configuration.frameRate = 5;
            utilSpy.isNumber = utility.isNumber;
            injector.mock({
                collision: collision,
                dialogue: dialogue,
                utility: utilSpy
            }).require(['object'], function (object) {
                utilSpy.isObject.calls.reset();
                var entity = new object.Entity(configuration);
                expect(utilSpy.isObject).toHaveBeenCalledTimes(1);
                entity.activate();
                setTimeout(function () {
                    expect(utilSpy.isObject).toHaveBeenCalledTimes(4);
                    entity.deactivate(21);
                }, 19);
                setTimeout(function() {
                    expect(utilSpy.isObject).toHaveBeenCalledTimes(4);
                }, 39);
                setTimeout(function () {
                    expect(utilSpy.isObject).toHaveBeenCalledTimes(8);
                    done();
                }, 65);
            });
        });

        it('should traject an object and determine if it has stopped or is moving', function (done) {
            configuration.parent = document.createElement('canvas');
            var injector = new Squire(), MOVING = true;
            spyOn(utility, 'isObject');
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration);
                entity.activate();
                expect(entity.isMoving()).not.toBe(MOVING);

                entity.traject(constants.right, 10, false);
                expect(entity.isMoving()).toBe(MOVING);
                expect(entity.trajecting()).toBe(constants.right);

                entity.stop();
                expect(entity.isMoving()).not.toBe(MOVING);
                expect(entity.trajecting()).toBe(constants.right);

                entity.traject(constants.left, 10, false);
                expect(entity.isMoving()).toBe(MOVING);
                expect(entity.trajecting()).toBe(constants.left);

                entity.traject(constants.up, 10, false);
                expect(entity.trajecting()).toBe(constants.up);

                entity.traject(constants.down, 10, false);
                expect(entity.trajecting()).toBe(constants.down);

                done();
            });
        });

        it('should make an entity talk and be quiet', function (done) {
            var injector = new Squire(), GREETING = 'Hello World', TALKING = true;
            configuration.canDialogue = true;
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration), self = entity.returnSelf();

                entity.talk(GREETING);
                expect(self.dialogue.show).toHaveBeenCalledWith(GREETING);
                expect(entity.isTalking()).toBe(TALKING);

                entity.quiet();
                expect(self.dialogue.hide).toHaveBeenCalled();
                expect(entity.isTalking()).not.toBe(TALKING);
                done();
            });
        });

        it('should statically place an object at given coordinates', function (done) {
            var injector = new Squire();
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration), x = 200, y = 100;

                entity.place(x, y);
                expect(entity.x).toBe(x);
                expect(entity.y).toBe(y);

                x = 1000; y = 0;
                entity.place(x, y);
                expect(entity.x).toBe(x);
                expect(entity.y).toBe(y);

                x = 500; y = 500;
                entity.place(x, y);
                expect(entity.x).toBe(x);
                expect(entity.y).toBe(y);

                x = 300; y = 350;
                entity.place(x, y);
                expect(entity.x).toBe(x);
                expect(entity.y).toBe(y);

                done();
            });
        });

        it('should change the reload state frequency by modifying the object frame rate', function (done) {
            var injector = new Squire(), utilSpy = jasmine.createSpyObj('utility', ['isObject']);
            configuration.parent = document.createElement('div');
            configuration.frameRate = 5;
            utilSpy.isNumber = utility.isNumber;
            injector.mock({
                collision: collision,
                dialogue: dialogue,
                utility: utilSpy
            }).require(['object'], function (object) {
                utilSpy.isObject.calls.reset();
                var entity = new object.Entity(configuration);
                expect(utilSpy.isObject).toHaveBeenCalledTimes(1);
                entity.activate();
                setTimeout(function () {
                    expect(utilSpy.isObject).toHaveBeenCalledTimes(4);
                    entity.setFrameRate(10);
                }, 19);
                setTimeout(function () {
                    expect(utilSpy.isObject).toHaveBeenCalledTimes(7);
                    done();
                }, 55);
            });
        });

        it('should display and handle json defined custom animations for an entity object', function (done) {
            configuration.parent = document.createElement('div');
            configuration.frameRate = 1;
            var injector = new Squire();
            injector.mock({
                collision: collision,
                dialogue: dialogue
            }).require(['object'], function (object) {
                var entity = new object.Entity(configuration), self = entity.returnSelf();
                self.ctx = jasmine.createSpyObj('ctx', ['clearRect', 'drawImage']);
                entity.activate();
                entity.animate({name: 'animate-movingUp', type: 'iterate'});
                setTimeout(function () {
                    expect(self.ctx.clearRect).toHaveBeenCalledWith(0, 0, 50, 80);
                }, 3);
                setTimeout(function () {
                    expect(self.ctx.drawImage).toHaveBeenCalledWith(self.image, 10, 20, 50, 80, 0, 0, 50, 80);
                    expect(self.ctx.drawImage).toHaveBeenCalledWith(self.image, 82, 20, 50, 80, 0, 0, 50, 80);
                    expect(self.ctx.drawImage).toHaveBeenCalledWith(self.image, 154, 20, 50, 80, 0, 0, 50, 80);
                    expect(self.ctx.drawImage).toHaveBeenCalledWith(self.image, 154, 20, 50, 80, 0, 0, 50, 80);
                    done();
                }, 10);
            });
        });
    });
});