/**
 * Created by Chris on 10/8/2015.
 */
define('stage', ['exports'], function (stage, utility, http) {

    var self = {
        container: document.createElement('div'),
        backgroundImage: new Image(),
        screenType: String(),
        loading: {},
        objects: {},
        id: null
    };

    self.loaded = function (id) {
        return self.loading[id] === true;
    };

    self.loadObjects = function (objects) {

    };

    stage.element = function () {
        return self.container;
    };

    stage.load = function (config) {
        self.backgroundImage = config.backgroundImage;
        self.screenType = config.screenType;
        self.id = config.id;

        if (utility.isArray(config.objects)) {
            self.loadObjects();
        }
    };

    stage.finishedLoading = function () {

    };
});
//function Stage(params) {
//
//    // Binds the stage object to the body of the Html Document
//    var $stage = params.container || document.body,
//
//        // Ensures variable params is a valid object
//        params = _util.isObject(params) ? params : {},
//
//        // All the objects and entities present on this stage
//        // Indexed by id
//        entities = {},
//
//        // Save the stage object to the variable self
//        self = this,
//
//        screenLock,
//
//        // Queue of all objects waiting to be placed when placeAll is called
//        placeQueue = [];
//
//    self.id = params.id;
//    // If the stage container isn't the body element
//    // add itself to the screen
//    if ($stage !== document.body) {
//        document.body.appendChild($stage);
//    }
//
//    if (params.background && params.background.color) {
//        self.id = self.id ? self.id : 'currentStage-fullscreen';
//        // $stage.setAttribute('class', 'full-screen');
//        $stage.setAttribute('style', _util.jsonToCSS({
//            'background-color': params.background.color,
//
//            /* Dynamically allocate these values based on how big
//             * the client screen is to make edges remain consistent */
//            height: _util.getWindowHeight(),
//            width: _util.getWindowWidth(),
//            position: 'absolute',
//            left: 0,
//            top: 0
//        }));
//
//    } else if (params.background && params.background.image) {
//        self.id = self.id ? self.id : 'currentStage-backgroundImage';
//
//        // May make this conditional branch obsolete
//        // Enforce loading all stage image data before game finishes loading
//        if (params.background.image.src) {
//            self.backgroundImage = new Image();
//            self.backgroundImage.src = params.background.image.src;
//            self.backgroundImage.onload = function () {
//                $stage.setAttribute('style', _util.jsonToCSS({
//                    'background-image': 'url(' + this.src + ')',
//                    height: this.height + 'px',
//                    width: this.width + 'px',
//                    position: 'absolute',
//                    left: '0px',
//                    top: '0px'
//                }));
//                resize();
//                params.cd.add(this);
//
//            };
//        } else if (params.background.image.object) {
//            self.backgroundImage = params.background.image.object;
//            $stage.setAttribute('style', _util.jsonToCSS({
//                'background-image': 'url(' + self.backgroundImage.src + ')',
//                height: self.backgroundImage.height + 'px',
//                width: self.backgroundImage.width + 'px',
//                position: 'absolute',
//                left: '0px',
//                top: '0px'
//            }));
//            resize();
//            params.cd.add(self);
//        }
//    }
//
//    $stage.setAttribute('id', self.id);
//
//    self.queue = function(entity) {
//        placeQueue.push({
//            object: entity,
//            id: entity.id
//        });
//    };
//
//    self.placeAll = function() {
//        while (placeQueue.length > 0) {
//            self.placeEntity(placeQueue.pop());
//        }
//    };
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
//
//    /**
//     * @description locks the game screen on an object moving across the stage
//     * @param id - the id of the entity that is being tracked
//     */
//    self.lockOn = function(id) {
//        if (!entities[id] || !entities[id].height || !entities[id].width) return;
//
//        screenLock = setInterval(function() {
//            var scrollLimitX = self.width - parseInt(self.gameScreen.width),
//                scrollLimitY = self.height - parseInt(self.gameScreen.height),
//                locationX = entities[id].x + (entities[id].width / 2),
//                locationY = entities[id].y + (entities[id].height / 2),
//                adjustPointX,
//                adjustPointY;
//
//            adjustPointY = locationY - (parseInt(self.gameScreen.height) / 2);
//            adjustPointX = locationX - (parseInt(self.gameScreen.width) / 2);
//
//            adjustPointY = adjustPointY < scrollLimitY ? adjustPointY : scrollLimitY;
//            adjustPointX = adjustPointX < scrollLimitX ? adjustPointX : scrollLimitX;
//
//            adjustPointY = (adjustPointY > 0 ? adjustPointY : 0);
//            adjustPointX = (adjustPointX > 0 ? adjustPointX : 0);
//
//            window.scrollTo(adjustPointX, adjustPointY);
//        }, 1);
//    };
//
//    self.releaseLock = function() {
//        clearInterval(screenLock);
//    };
//
//    // Generate boundary dimensions
//    self.resize = function () {
//        resize();
//    };
//
//    function resize() {
//        self.gameScreen = {height: _util.getWindowHeight(), width: _util.getWindowWidth()};
//        var bounds = $stage.getBoundingClientRect();
//        self.height = bounds.height;
//        self.width = bounds.width;
//        self.x = bounds.left;
//        self.y = bounds.top;
//    }
//
//    self.activate = function() {
//        activateEntities();
//    };
//
//    function activateEntities () {
//
//        for (var entity in entities) {
//            if (entities[entity].activate)
//                entities[entity].activate();
//        }
//    }
//
//    self.resize();
//}