/**
 * Created by Chris on 10/8/2015.
 */

function Game() {

    var interaction = new Interactivity(),
        collision = new Collision(),
        http = new HttpRequest(),
        entities = {},
        loading = {},

        // May pass in the game object so every
        // entity has high level access to the game
        self = this;

    self.play = function (withInteractions) {
        _util.waitUntil(self.finishedLoading, [], function() {
            self.currentStage.placeAll();
            self.currentStage.lockOn('character');
            self.currentStage.activate();

            if (_util.isArray(withInteractions)) {
                for (var index = 0; index < withInteractions.length; index++) {
                    var interact = withInteractions[index];
                    interaction.add({
                        id: interact.id,
                        objects: populateObjects(interact.objects),
                        trigger: entities[interact.trigger],
                        active: interact.active,
                        type: interact.type,
                        config: interact.config,
                        does: interact.does
                    });
                }
            }

        }, []);
    };

    self.load = function (config) {
        var /* mainCharacter = config.mainCharacter, */ stage = config.stage;
        interaction.detector(collision);

        // loading[mainCharacter.id] = false;
        loading[stage.id] = false;
        self.config = config;

        var backgroundImage = new Image();
        backgroundImage.src = stage.backgroundImage;
        backgroundImage.onload = function() {
            loading[stage.id] = true;
            self.currentStage = new Stage({
                container: document.createElement('div'),
                screenType: 'full',
                id: stage.id,
                cd: collision,
                background: {
                    image: {
                        object: backgroundImage
                    }
                }
            });
        };
        if (stage.objects) {

            for (var so=0; so < stage.objects.length; so++) {

                if (stage.objects[so].load) {
                    loading[stage.objects[so].id] = false;
                    http.get({
                        id: stage.objects[so].id,
                        url: stage.objects[so].load,
                        onSuccess: function(response) {
                            var o = JSON.parse(response), objectId = this.id;
                            entities[objectId] = new Object({
                                canDialogue: o.canDialogue,
                                canCollide: o.canCollide,
                                facing: o.facing,
                                sprite: o.sprite,
                                cd: collision,
                                id: objectId
                            });

                            _util.waitUntil(loaded, [stage.id], function() {
                                self.currentStage.queue(entities[objectId]);
                                loading[objectId] = true;
                            }, []);

                            if (o.hasOwnProperty('aiLogic')) {
                                loading[objectId + 'aiLogic'] = false;
                                http.get({
                                    url: o['aiLogic'],
                                    onSuccess: function(response) {
                                        var ai = JSON.parse(response);
                                        entities[objectId].loadAI(ai);
                                        entities[objectId].startAI();

                                        _util.waitUntil(loaded, [stage.id], function() {
                                            loading[objectId + 'aiLogic'] = true;
                                        }, []);
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    };

    self.finishedLoading = function() {
        var finished = true;
        for (var entity in loading) {
            finished = (loading[entity] ? true : false);
            if (!finished) break;
        }

        return finished;
    };

    self.getEntityById = function(id) {
        return entities.hasOwnProperty(id) ? entities[id] : {};
    };

    function populateObjects(objects) {
        var o = {};
        if (objects && _util.isArray(objects)) {
            for (var i = 0; i < objects.length; i++) {
                if (_util.isString(objects[i])) {
                    o[objects[i]] = entities[objects[i]];
                }
                else if (_util.isObject(objects[i]) && objects[i].id && _util.isObject(objects[i].object)) {
                    o[objects[i].id] = objects[i].object;
                }
            }
        }

        return o;
    }

    function loaded(id) {
        return loading.hasOwnProperty(id) &&
            loading[id] ? true : false;
    }
}