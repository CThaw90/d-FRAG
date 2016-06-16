/**
 * Created by Chris on 10/8/2015.
 */

define('game', ['exports', 'stage'], function (game, stage) {

    var self = {
        backgroundImage: null,
        loading: {},
        config: {}
    };

    game.load = function (config) {

        var stageConfig = config.stage;

        self.loading[stageConfig.id] = false;
        self.config = config;

        self.backgroundImage = new Image();
        self.backgroundImage.src = stageConfig.background;
        self.backgroundImage.onload = function () {
            self.loading[stageConfig.id] = true;
            stage.load({
                backgroundImage: self.backgroundImage,
                screenType: 'full',
                id: stageConfig.id
            });
        };
    };
});

//function Game () {
//
//    var interaction = new Interactivity(),
//        collision = new Collision(),
//        http = new HttpRequest(),
//        entities = {},
//        loading = {},
//        scene  = new Scene({
//            modules: {
//                interact: interaction,
//                collision: collision,
//                entities: entities,
//                http: http
//            }
//        }),
//
//        // May pass in the game object so every
//        // entity has high level access to the game
//        self = this;
//
//    self.play = function (withInteractions) {
//        _util.waitUntil(self.finishedLoading, [], function() {
//            self.currentStage.placeAll();
//            self.currentStage.lockOn('character');
//            self.currentStage.activate();
//
//            if (_util.isArray(withInteractions)) {
//                for (var index = 0; index < withInteractions.length; index++) {
//                    var interact = withInteractions[index];
//                    interaction.add({
//                        id: interact.id,
//                        objects: populateObjects(interact.objects),
//                        trigger: entities[interact.trigger],
//                        active: interact.active,
//                        type: interact.type,
//                        config: interact.config,
//                        does: interact.does
//                    });
//                }
//            }
//
//            scene.run('introduction');
//
//        }, []);
//    };
//
//    self.load = function (config) {
//        var stage = config.stage;
//        interaction.detector(collision);
//
//        loading[stage.id] = false;
//        self.config = config;
//
//        var backgroundImage = new Image();
//        backgroundImage.src = stage.backgroundImage;
//        backgroundImage.onload = function() {
//            loading[stage.id] = true;
//            self.currentStage = new Stage({
//                container: document.createElement('div'),
//                screenType: 'full',
//                id: stage.id,
//                cd: collision,
//                background: {
//                    image: {
//                        object: backgroundImage
//                    }
//                }
//            });
//        };
//        if (stage.objects) {
//
//            for (var so=0; so < stage.objects.length; so++) {
//
//                if (stage.objects[so].load) {
//                    loading[stage.objects[so].id] = false;
//                    http.get({
//                        id: stage.objects[so].id,
//                        url: stage.objects[so].load,
//                        onSuccess: function(response) {
//                            var o = JSON.parse(response), objectId = this.id;
//                            entities[objectId] = new Object({
//                                canDialogue: o.canDialogue,
//                                canCollide: o.canCollide,
//                                frameRate: o.frameRate,
//                                facing: o.facing,
//                                sprite: o.sprite,
//                                cd: collision,
//                                id: objectId
//                            });
//
//                            _util.waitUntil(loaded, [stage.id], function() {
//                                self.currentStage.queue(entities[objectId]);
//                                loading[objectId] = true;
//                            }, []);
//
//                            if (o.hasOwnProperty('aiLogic')) {
//                                loading[objectId + 'aiLogic'] = false;
//                                http.get({
//                                    url: o['aiLogic'],
//                                    onSuccess: function(response) {
//                                        var ai = JSON.parse(response);
//
//                                        _util.waitUntil(loaded, [stage.id], function() {
//                                            loading[objectId + 'aiLogic'] = true;
//                                            entities[objectId].loadAI(ai);
//                                            entities[objectId].startAI();
//                                        }, []);
//                                    }
//                                });
//                            }
//                        }
//                    });
//                }
//            }
//        }
//
//        if (stage.scenes) {
//
//            for (var ss=0; ss < stage.scenes.length; ss++) {
//
//                if (stage.scenes[ss].load) {
//                    loading[stage.scenes[ss].id] = false;
//                    http.get({
//                        id: stage.scenes[ss].id,
//                        url: stage.scenes[ss].load,
//                        onSuccess: function (response) {
//                            var s = JSON.parse(response), sceneId = this.id, actors = {};
//                            for (var a=0; a < s.actors.length; a++) {
//                                if (entities[s.actors[a]])
//                                actors[s.actors[a]] = entities[s.actors[a]];
//                            }
//                            scene.add({
//                                id: sceneId,
//                                name: s.name,
//                                actors: actors,
//                                actions: s.actions
//                            });
//
//                            loading[sceneId] = true;
//                        }
//                    })
//                }
//            }
//        }
//    };
//
//    self.finishedLoading = function() {
//        var finished = true;
//        for (var entity in loading) {
//            finished = (loading[entity] ? true : false);
//            if (!finished) break;
//        }
//
//        return finished;
//    };
//
//    self.getEntityById = function(id) {
//        return entities.hasOwnProperty(id) ? entities[id] : {};
//    };
//
//    function populateObjects(objects) {
//        var o = {};
//        if (objects && _util.isArray(objects)) {
//            for (var i = 0; i < objects.length; i++) {
//                if (_util.isString(objects[i])) {
//                    o[objects[i]] = entities[objects[i]];
//                }
//                else if (_util.isObject(objects[i]) && objects[i].id && _util.isObject(objects[i].object)) {
//                    o[objects[i].id] = objects[i].object;
//                }
//            }
//        }
//
//        return o;
//    }
//
//    function loaded(id) {
//        return loading.hasOwnProperty(id) &&
//            loading[id] ? true : false;
//    }
// }