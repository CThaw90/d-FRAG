/**
 * Created by Chris on 10/8/2015.
 */
define('stage', ['exports', 'utility', 'screen', 'collision', 'http', 'object', 'ai'], function (stage, utility, screen, collision, http, object, ai) {

    var self = {
        container: document.createElement('div'),
        backgroundImage: null,
        screenType: String(),
        loading: {},
        objects: {},
        id: null
    };

    self.loaded = function (id) {
        return self.loading[id] === true;
    };

    self.loadObjects = function (objects) {
        objects.forEach(function (obj) {
            self.loading[obj.id] = false;
            http.get({
                id: obj.id,
                url: obj.load,
                onSuccess: function (response) {
                    var o = JSON.parse(response), objectId = this.id;
                    self.objects[objectId] = new object.Entity({
                        canDialogue: o.canDialogue,
                        frameRate: o.frameRate,
                        parent: self.container,
                        facing: o.facing,
                        sprite: o.sprite,
                        id: objectId
                    });

                    utility.waitUntil(self.objects[objectId].finishedLoading, [], function () {
                        self.loading[objectId] = true;
                    }, []);
                }
            });
        });
    };

    self.loadAIs = function (ais) {
        ais.forEach(function (ai) {
            if (self.loading[ai.id] !== undefined) {
                console.log('Configuration already loaded with unique identifier \'' + ai.id + '\'');
                return;
            }

            self.loading[ai.id] = false;
            http.get({
                id: ai.id,
                url: ai.load,
                onSuccess: function (response) {
                    console.log(JSON.parse(response));
                    self.loading[this.id] = true;
                }
            })
        });
    };

    stage.activate = function () {
        for (var obj in self.objects) {
            if (self.objects.hasOwnProperty(obj)) {
                self.objects[obj].activate();
            }
        }

        collision.add(stage);
    };

    stage.element = function () {
        return self.container;
    };

    stage.load = function (config) {
        self.backgroundImage = config.backgroundImage;
        self.screenType = config.screenType;
        stage.id = config.id || 'main-stage';

        if (utility.isArray(config.objects)) {
            self.loadObjects(config.objects);
        }
        else {
            console.log('No objects have been loaded to this stage');
        }

        if (utility.isArray(config.ais)) {
            self.loadAIs(config.ais);
        }
        else {
            console.log('No AIs have been loaded to this stage');
        }

        self.container.setAttribute('id', stage.id);
    };

    stage.create = function () {

        self.container.setAttribute('style', utility.jsonToCSS({
            'background-image': 'url(' + self.backgroundImage.src + ')',
            height: self.backgroundImage.height + 'px',
            width: self.backgroundImage.width + 'px',
            position: 'absolute',
            left: '0px',
            top: '0px'
        }));

        document.body.appendChild(self.container);
        stage.resize();
    };

    stage.resize = function () {
        stage.height = self.container.offsetHeight;
        stage.width = self.container.offsetWidth;
        stage.x = self.container.offsetLeft;
        stage.y = self.container.offsetTop;
    };

    stage.returnSelf = function () {
        return self;
    };

    stage.finishedLoading = function () {
        // Stage
        var finished = true;
        Object.keys(self.loading).forEach(function (key) {
            finished = finished && self.loading[key];
        });

        return finished;
    };

    stage.objects = function () {
        return self.objects;
    };

    stage.getObject = function (id) {
        return self.objects[id];
    };
});
//function Stage(params) {
//
//    self.placeEntity = function (params) {
//
//        if (!params.id) {
//            console.log("No id for entity. Cannot place on stage");
//            return;
//        }
//
//        $stage.appendChild(params.object.$container);
//        entities[params.id] = params.object;
//    };
//
//    self.removeEntity = function(id) {
//
//        if (!entities[id]) return;
//
//        $stage.removeChild(entities[id].$container);
//        delete entities[id];
//    };
//    self.releaseLock = function() {
//        clearInterval(screenLock);
//    };
//}