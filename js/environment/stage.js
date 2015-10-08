/**
 * Created by Chris on 10/8/2015.
 */

function Stage($container, params) {

    // The document object that contains the stage on the canvas
    var $stage = $util.isHtmlElement($container) ? $container : document.body,

        $context = $stage.getContext('2d');

    params = $util.isObject(params) ? params : {};

    // Save the stage object to the variable self
    var self = this;

    // Dimensions of the current stage
    $stage.height = params.height || $const.stageHeight;
    $stage.width = params.width || $const.stageWidth;

    self.placeEntity = function (object, params) {

    };
}