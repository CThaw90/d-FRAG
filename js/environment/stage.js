/**
 * Created by Chris on 10/8/2015.
 */

function Stage(params) {

    // Binds the stage object to the body of the Html Document
    var $stage = document.body,

        // Ensures variable params is a valid object
        params = $util.isObject(params) ? params : {},

        // All the objects and entities present on this stage
        // Indexed by id
        entities = {},

        // Save the stage object to the variable self
        self = this;

    // Dimensions of the current stage
    // $stage.height = params.height || $util.getWindowHeight();
    // $stage.width = params.width || $util.getWindowWidth();

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
}