/**
 * Created by christhaw on 8/5/16.
 */
define(['Squire'], function (Squire) {
    /* globals describe, xit, it, beforeEach, jasmine, spyOn, JSON */
    describe('Screen module', function () {
        var stage;
        beforeEach(function () {
            stage = jasmine.createSpyObj('stage', ['element']);
        });

        it('should return the screen dimensions from the window object', function (done) {
            window.innerHeight = 367;
            window.innerWidth = 763;
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['screen'], function (screen) {
                expect(screen.height()).toEqual('367px');
                expect(screen.width()).toEqual('763px');
                done();
            });
        });

        it('should reposition the screen to use the selected coordinates', function (done) {
            var injector = new Squire();
            spyOn(window, 'scrollTo');
            injector.mock({
                stage: stage
            }).require(['screen'], function (screen) {
                screen.reposition(100, 200);
                expect(window.scrollTo).toHaveBeenCalledWith(100, 200);

                screen.reposition('333', '444');
                screen.reposition(false, false);
                screen.reposition({}, {});
                expect(window.scrollTo).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should lock on to an entity object and adjust screen on its movements', function (done) {
            var entity = {id: 'entityObject', height: 200, width: 200, y: 0, x: 50}, injector;
            spyOn(window, 'scrollTo');
            window.innerHeight = 300;
            window.innerWidth = 300;
            stage.height = 1000;
            stage.width = 1000;
            injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['screen'], function (screen) {
                screen.lockOn(entity);
                setTimeout(function () { entity.x = 55; }, 5);
                setTimeout(function () { entity.x = 70; }, 15);
                setTimeout(function () { entity.y = 100;}, 25);
                setTimeout(function () { screen.releaseLock(); }, 30);
                setTimeout(function () {
                    expect(window.scrollTo).not.toHaveBeenCalledWith(1, 0);
                    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
                    expect(window.scrollTo).toHaveBeenCalledWith(5, 0);
                    expect(window.scrollTo).toHaveBeenCalledWith(20, 0);
                    expect(window.scrollTo).toHaveBeenCalledWith(20, 50);
                    done();
                }, 70);
                setTimeout(function () { entity.x = 60; }, 35);
                setTimeout(function () { entity.y = 90; }, 45);
                setTimeout(function () { entity.y = 80; }, 55);
                setTimeout(function () {
                    expect(window.scrollTo).not.toHaveBeenCalledWith(10, 50);
                    expect(window.scrollTo).not.toHaveBeenCalledWith(10, 40);
                    expect(window.scrollTo).not.toHaveBeenCalledWith(10, 30);
                }, 60);
            });
        });

        it('should determine if the screen is locked on an object', function (done) {
            var entity = {id: 'entityObject', height: 100, width: 200, x: 100, y: 100},
                injector = new Squire();

            injector.mock({
                stage: stage
            }).require(['screen'], function (screen) {
                screen.lockOn({});
                expect(screen.isLocked()).toBe(false);

                screen.lockOn(entity);
                expect(screen.isLocked()).toBe(true);

                screen.releaseLock();
                expect(screen.isLocked()).toBe(false);

                done();
            });
        });

        it('should fade in the game screen from all black', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['screen'], function (screen) {
                var self = screen.returnSelf();
                spyOn(self.fadeElement, 'setAttribute');
                spyOn(self.window, 'setTimeout').and.callFake(function (innerFunction) {
                    innerFunction();
                });
                screen.fadeFromBlack(5);
                expect(self.window.setTimeout).toHaveBeenCalledWith(jasmine.any(Function), 1);

                done();
            });
        });
    });
});