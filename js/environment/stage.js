/**
 * Created by Chris on 10/8/2015.
 */

function Stage($container, params) {

    // The document object that contains the stage on the canvas
    var $stage = $util.isHtmlElement($container) ? $container : document.body,

        $objects = {};

    params = $util.isObject(params) ? params : {};

    // Save the stage object to the variable self
    var self = this;

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

        $container.appendChild(object.$container);
    };
}