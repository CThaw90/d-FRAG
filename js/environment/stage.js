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
        self = this;

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
        $stage.backgroundImage = params.background.image;
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

    // Generate boundary dimensions
    self.resize = function () {

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

    // Setting dimensions of the stage object
    var bounds = $stage.getBoundingClientRect();
    self.height = bounds.height;
    self.width = bounds.width;
    self.x = bounds.left;
    self.y = bounds.top;
}