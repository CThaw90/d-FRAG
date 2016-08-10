/**
 * Created by christhaw on 8/9/16.
 */
define(['Squire'], function (Squire) {
    /* globals describe, it, xit, beforeEach, jasmine */
    describe('Scene module', function () {

        var interact, http, collision, ai, stage;

        beforeEach(function () {
            ai = jasmine.createSpyObj('ai', ['start']);
            collision = jasmine.createSpyObj('collision', ['check']);
            interact = jasmine.createSpyObj('interact', ['disableAll']);
            http = jasmine.createSpyObj('http', ['get']);
            stage = jasmine.createSpyObj('stage', ['getObject']);
        });

        it('should add a valid scene and ignore invalid configurations and remove it', function (done) {
            var injector = new Squire(), string = 'THIS_IS_NOT_AN_OBJECT',
                invalidScene = getJSONFixture('json/scene/invalid_scene.json'),
                validScene = getJSONFixture('json/scene/valid_scene.json');
            injector.mock({
                ai: ai,
                collision: collision,
                interact: interact,
                http: http,
                stage: stage
            }).require(['scene'], function (scene) {
                var self = scene.returnSelf();
                scene.add(invalidScene);
                scene.add(validScene);
                scene.add(string);

                expect(self.sceneDict[string]).toBeUndefined();
                expect(self.sceneDict[invalidScene.id]).toBeUndefined();
                expect(self.sceneDict[validScene.id]).not.toBeUndefined();
                expect(self.sceneDict[validScene.id]).toEqual(jasmine.any(Object));
                expect(self.sceneDict[validScene.id].execution).toEqual(jasmine.any(Array));

                scene.remove('d-FRAG_game_introduction_scene');
                expect(self.sceneDict['d-FRAG_game_introduction_scene']).toBeUndefined();
                
                done();
            });
        });
    });
});