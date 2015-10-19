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

    // If the stage container isn't the body element
    // add itself to the screen
    if ($stage !== document.body) {
        document.body.appendChild($stage);
    }
    // Dimensions of the current stage
    // $stage.height = params.height || _util.getWindowHeight();
    // $stage.width = params.width || _util.getWindowWidth();

    if (params.background && params.background.color) {
        //$stage.setAttribute('style', 'background-color: '+params.background.color +
        //                    ';position: relative;height: 99%'+
        //                    ';width: 99%;overflow: hidden;');
        $stage.setAttribute('class', 'full-screen');
    } else if (params.background && params.background.image) {
        $stage.backgroundImage = params.background.image;
    }

    self.placeEntity = function (object, params) {

        if (!params.id) return;

        $stage.appendChild(object.$container);
        entities[params.id] = object;
    };

    self.removeEntity = function(id) {

        if (!entities[id]) return;

        $stage.removeChild(entities[id].$container);
        delete entities[id];
    };

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
}