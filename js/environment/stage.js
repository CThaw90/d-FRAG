/**
 * Created by Chris on 10/8/2015.
 */

function Stage(params) {

    // Binds the stage object to the body of the Html Document
    var $stage = params.container || document.body,

        // Ensures variable params is a valid object
        params = _util.isObject(params) ? params : {},

        // All the objects and entities present on this stage
        // Indexed by id
        entities = {},

        // Save the stage object to the variable self
        self = this,

        screenLock;

    self.id = params.id;
    // If the stage container isn't the body element
    // add itself to the screen
    if ($stage !== document.body) {
        document.body.appendChild($stage);
    }

    if (params.background && params.background.color) {
        self.id = self.id ? self.id : 'currentStage-fullscreen';
        // $stage.setAttribute('class', 'full-screen');
        $stage.setAttribute('style', _util.jsonToCSS({
            'background-color': params.background.color,

            /* Dynamically allocate these values based on how big
             * the client screen is to make edges remain consistent */
            height: _util.getWindowHeight(),
            width: _util.getWindowWidth(),
            position: 'absolute',
            left: 0,
            top: 0
        }));
        $stage.setAttribute('id', self.id);

    } else if (params.background && params.background.image) {
        self.id = self.id ? self.id : 'currentStage-backgroundImage';

        self.backgroundImage = new Image();
        self.backgroundImage.src = params.background.image.src;
        self.backgroundImage.onload = function() {
            $stage.setAttribute('style', _util.jsonToCSS({
                'background-image': 'url('+this.src+ ')',
                height: this.height + 'px',
                width: this.width + 'px',
                position: 'absolute',
                left: '1px',
                top: '1px'
            }));
            self.resize();
            params.cd.add(this);
        };

        $stage.setAttribute('id', self.id);
    }

    self.placeEntity = function (params) {

        if (!params.id) return;

        $stage.appendChild(params.object.$container);
        entities[params.id] = params.object;
    };

    self.removeEntity = function(id) {

        if (!entities[id]) return;

        $stage.removeChild(entities[id].$container);
        delete entities[id];
    };

    /**
     * @description locks the game screen on an object moving across the stage
     * @param id - the id of the entity that is being tracked
     */
    self.lockOn = function(id) {
        if (!entities[id]) return;

        screenLock = setInterval(function() {

        }, 1);
    };

    self.releaseLock = function() {
        clearInterval(screenLock);
    };

    // Generate boundary dimensions
    self.resize = function () {
        self.gameScreen = {width: _util.getWindowWidth(), height: _util.getWindowHeight()};
        var bounds = $stage.getBoundingClientRect();
        self.height = bounds.height;
        self.width = bounds.width;
        self.x = bounds.left;
        self.y = bounds.top;
    };

    self.activate = function() {
        activateEntities();
    };

    function activateEntities () {

        for (var entity in entities) {
            if (entities[entity].activate)
                entities[entity].activate();
        }
    }

    self.resize();
}