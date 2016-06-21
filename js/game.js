/**
 * Created by Chris on 10/8/2015.
 */

define('game', ['exports', 'utility', 'stage'], function (game, utility, stage) {

    var self = {
        loading: {},
        config: {}
    };

    game.load = function (config) {
        var stageConfig = config.stage;

        self.loading[stageConfig.id] = false;
        self.config = config;

        self.backgroundImage = new Image();
        self.backgroundImage.src = stageConfig.backgroundImage;
        self.backgroundImage.onload = function () {
            stage.load({
                backgroundImage: self.backgroundImage,
                objects: stageConfig.objects,
                screenType: 'full',
                id: stageConfig.id
            });

            utility.waitUntil(stage.finishedLoading, [], function () {
                self.loading[stageConfig.id] = true;
                stage.create();
            }, []);
        };

        utility.waitUntil(game.finishedLoading, [], function () {
            console.log('Game finished loading...');
        }, []);
    };

    game.play = function () {
    };

    game.finishedLoading = function () {
        var finished = true;
        Object.keys(self.loading).forEach(function (key) {
            finished = finished && self.loading[key];
        });

        return finished;
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
//
//            scene.run('introduction');
//
//        }, []);
//    };
//
//    self.load = function (config) {
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
// }