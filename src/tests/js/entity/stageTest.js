/**
 * Created by christhaw on 8/10/16.
 */
define(['Squire'], function (Squire) {
    /* globals describe, xit, it, beforeEach, jasmine, spyOn */
    describe('Stage module', function () {

        var collision, http, object, ai, config, mockHttpObject;

        beforeEach(function () {
            ai = jasmine.createSpyObj('ai', ['add']);
            collision = jasmine.createSpyObj('collision', ['add']);
            http = jasmine.createSpyObj('http', ['get']);
            object = jasmine.createSpyObj('object', ['Entity']);
            config = {backgroundImage: {src: '/base/src/main/components/images/stages/grass.png'}, id: 'testingStage'};

            object.Entity = function () {};
            object.Entity.prototype = jasmine.createSpyObj('Entity', ['finishedLoading', 'activate']);
            object.Entity.prototype.finishedLoading.and.returnValue(true);
            mockHttpObject = {canDialogue: true, frameRate: 50, facing: 'right', sprite: {}};
        });

        it('should load a stage object ready to be created', function (done) {
            var injector = new Squire();
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                stage.load(config);
                expect(stage.id).toBe('testingStage');
                expect(stage.finishedLoading()).toBe(true);
                done();
            });
        });

        it('should load a stage object ready to be created with objects', function (done) {
            config.objects = [{id: 'object1'}, {id: 'object2'}, {id: 'object3'}, {id: 'object4'}];
            var injector = new Squire(), FINISHED = true;
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                var httpCallback = [], assertObject = new object.Entity();
                http.get.and.callFake(function (httpConfig) {
                    httpCallback.push(httpConfig);
                });
                expect(assertObject.finishedLoading).toBeDefined();
                expect(assertObject.finishedLoading()).toBe(FINISHED);
                expect(stage.finishedLoading()).toBe(FINISHED);
                stage.load(config);
                expect(stage.finishedLoading()).not.toBe(FINISHED);
                for (var index = 0; index < config.objects.length; index++) {
                    expect(httpCallback[index].id).toBe(config.objects[index].id);
                    httpCallback[index].onSuccess.call(config.objects[index], JSON.stringify({}));
                }
                setTimeout(function () {
                    expect(stage.finishedLoading()).toBe(FINISHED);
                    done();
                }, 20);
            });
        });

        it('should load a stage object ready to be created with ais', function (done) {
            config.ais = [
                {id: 'engine1', url: 'http://d-FRAG.play/artificial-intelligence/engine1.json'},
                {id: 'engine2', url: 'http://d-FRAG.play/artificial-intelligence/engine2.json'},
                {id: 'engine3', url: 'http://d-FRAG.play/artificial-intelligence/engine3.json'},
                {id: 'engine4', url: 'http://d-FRAG.play/artificial-intelligence/engine4.json'},
                {id: 'engine5', url: 'http://d-FRAG.play/artificial-intelligence/engine5.json'}
            ];
            var injector = new Squire(), FINISHED = true;
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                var httpCallback = [], assertObject = new object.Entity();
                http.get.and.callFake(function (httpConfig) {
                    httpCallback.push(httpConfig);
                });
                expect(stage.finishedLoading()).toBe(FINISHED);
                expect(ai.add).not.toHaveBeenCalled();
                stage.load(config);

                expect(stage.finishedLoading()).not.toBe(FINISHED);
                httpCallback.forEach(function (callback) {
                    callback.onSuccess(JSON.stringify(assertObject));
                });

                expect(ai.add).toHaveBeenCalledTimes(5);
                expect(ai.add).toHaveBeenCalledWith(jasmine.any(Object));

                done();
            });
        });

        xit('should create a stage object with appropriate dimensions and append to the body', function (done) {
            var STYLE_STRING = 'background-image: url(http://d-FRAG.play/tests/backgroundImage.png); ' +
                                'height: 1000px; width: 1000px; position: absolute; left: 0px; top: 0px';

            config.backgroundImage.src = 'http://d-FRAG.play/tests/backgroundImage.png';
            config.backgroundImage.height = 1000;
            config.backgroundImage.width = 1000;
            var injector = new Squire(), container;
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                container = stage.element();
                stage.load(config);
                stage.create();

                expect(container.getAttribute('id')).toBe(config.id);
                expect(container.parentNode).toBe(document.body);
                expect(container.getAttribute('style')).toEqual(STYLE_STRING);
                done();
            });
        });

        it('should activate stage by enabling all objects and adding stage to the collision vector', function (done) {
            config.objects = [
                {id: 'object1', load: 'http://d-FRAG.play/d-FRAG-Content/object1.json', activate: ''},
                {id: 'object2', load: 'http://d-FRAG.play/d-FRAG-Content/object2.json', activate: ''},
                {id: 'object3', load: 'http://d-FRAG.play/d-FRAG-Content/object3.json', activate: ''},
                {id: 'object4', load: 'http://d-FRAG.play/d-FRAG-Content/object4.json', activate: ''},
                {id: 'object5', load: 'http://d-FRAG.play/d-FRAG-Content/object5.json', activate: ''}
            ];

            var injector = new Squire();
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                var self = stage.returnSelf();
                http.get.and.callFake(function (httpObject) {
                    httpObject.onSuccess(JSON.stringify(mockHttpObject));
                });
                stage.load(config);
                stage.create();
                Object.keys(self.objects).forEach(function (id) {
                    expect(self.objects[id].activate).not.toHaveBeenCalled();
                });

                stage.activate();
                expect(collision.add).toHaveBeenCalledWith(stage);
                Object.keys(self.objects).forEach(function (id) {
                    expect(self.objects[id].activate).toHaveBeenCalled();
                });

                done();
            });
        });

        it('should resize stage object according to the dimensions of backing image', function (done) {
            var injector = new Squire();
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                config.backgroundImage.height = 100;
                config.backgroundImage.width = 100;
                stage.load(config);
                stage.create();

                expect(stage.height).toBe(100);
                expect(stage.width).toBe(100);

                config.backgroundImage.height = 1000;
                config.backgroundImage.width = 1000;
                stage.load(config);
                stage.create();

                expect(stage.height).toBe(1000);
                expect(stage.width).toBe(1000);

                config.backgroundImage.height = 700;
                config.backgroundImage.width = 500;
                stage.load(config);
                stage.create();

                expect(stage.height).toBe(700);
                expect(stage.width).toBe(500);
                done();
            });
        });

        it('should place and remove entities from the stage object', function (done) {
            config.backgroundImage.height = 1000;
            config.backgroundImage.width = 1000;
            var injector = new Squire(),
                object1 = {id: 'object1', container: document.createElement('div'), element: function () { return this.container; }},
                object2 = {id: 'object2', container: document.createElement('div'), element: function () { return this.container; }},
                object3 = {id: 'object3', container: document.createElement('div'), element: function () { return this.container; }},
                object4 = {id: 'object4', container: document.createElement('div'), element: function () { return this.container; }},
                object5 = {id: 'object5', container: document.createElement('div'), element: function () { return this.container; }};
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                var self = stage.returnSelf();
                stage.load(config);
                stage.create();

                stage.placeEntity({id: object1.id, object: object1});
                stage.placeEntity({id: object2.id, object: object2});
                stage.placeEntity({id: object3.id, object: object3});
                stage.placeEntity({id: object4.id, object: object4});
                stage.placeEntity({id: object5.id, object: object5});

                expect(self.objects[object1.id]).toBe(object1);
                expect(self.objects[object2.id]).toBe(object2);
                expect(self.objects[object3.id]).toBe(object3);
                expect(self.objects[object4.id]).toBe(object4);
                expect(self.objects[object5.id]).toBe(object5);

                stage.removeEntity(object2.id);
                stage.removeEntity(object4.id);

                expect(self.objects[object2.id]).toBeUndefined();
                expect(self.objects[object4.id]).toBeUndefined();

                done();
            });
        });

        it('should be able to get objects that have been added or placed on the stage', function (done) {
            config.objects = getJSONFixture('json/stage/stageObjects.json');
            var injector = new Squire();
            injector.mock({
                collision: collision,
                object: object,
                http: http,
                ai: ai
            }).require(['stage'], function (stage) {
                http.get.and.callFake(function (httpObject) {
                    httpObject.onSuccess(JSON.stringify(mockHttpObject));
                });
                stage.load(config);
                stage.create();

                expect(stage.getObject('tree_a')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_b')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_c')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_d')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_e')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_f')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_g')).toBeUndefined();
                expect(stage.getObject('tree_h')).toEqual(jasmine.any(Object));
                expect(stage.getObject('tree_i')).toEqual(jasmine.any(Object));
                expect(stage.getObject('stone-walls_a')).toEqual(jasmine.any(Object));
                expect(stage.getObject('stone-walls_b')).toEqual(jasmine.any(Object));
                expect(stage.getObject('steel-door')).toEqual(jasmine.any(Object));
                expect(stage.getObject('black-door')).toEqual(jasmine.any(Object));
                expect(stage.getObject('character')).toEqual(jasmine.any(Object));
                expect(stage.getObject('harold')).toEqual(jasmine.any(Object));
                expect(stage.getObject('mr-lorenzo')).toEqual(jasmine.any(Object));
                expect(stage.getObject('mr-ree')).toEqual(jasmine.any(Object));
                expect(stage.objects()).toEqual(jasmine.any(Object));
                expect(Object.keys(stage.objects()).length).toEqual(config.objects.length);
                done();
            });
        });
    });
});