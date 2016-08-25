define(['Squire'], function (Squire) {

    /* globals describe, it, jasmine */
    describe('Main game application', function () {
        var stage = jasmine.createSpyObj('stage', ['load']),
            scene = jasmine.createSpyObj('scene', ['add']),
            http = jasmine.createSpyObj('http', ['get']);

        it('should be a valid object', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage,
                scene: scene,
                http: http
            }).require(['game'], function (game) {
                expect(game).toEqual(jasmine.any(Object));
                done();
            });
        });
    });
});