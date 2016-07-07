/**
 * Created by Chris on 10/8/2015.
 */
define('game', ['exports', 'utility', 'stage', 'scene', 'http'], function (game, utility, stage, scene, http) {

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
                ais: stageConfig.ais,
                screenType: 'full',
                id: stageConfig.id
            });

            utility.waitUntil(stage.finishedLoading, [], function () {
                self.loading[stageConfig.id] = true;
                stage.create();
            }, [], {onTimeout: stage.finishedLoading});
        };

        if (utility.isArray(config.scenes)) {
            config.scenes.forEach(function (s) {
                self.loading[s.id] = false;
                http.get({
                    id: s.id,
                    url: s.load,
                    onSuccess: function (response) {
                        self.loading[this.id] = true;
                        var sceneObject = JSON.parse(response);
                        scene.add(sceneObject);
                    }
                });
            });
        }
        else {
            console.log('No scenes have been loaded in with this level.');
        }

        utility.waitUntil(game.finishedLoading, [], function () {
            console.log('Game finished loading...');
        }, [], {onTimeout: game.finishedLoading});
    };

    game.play = function () {
        stage.activate();
    };

    game.finishedLoading = function () {
        var finished = true;
        Object.keys(self.loading).forEach(function (key) {
            finished = finished && self.loading[key];
        });

        return finished;
    };
});