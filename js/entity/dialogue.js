/**
 *
 * Created by ChrisThaw 01/28/2016
 *
 * A text dialogue object used to represent communication
 * between objects and other game entities.
 *
 * */
function DialogueBox() {

    var self = this, $arrow, displayed = false;

    self.show = function(entity, text) {

        displayed = true;
    };

    self.remove = function() {

        displayed = false;
    };

    self.isDisplayed = function() {
        return displayed;
    };

    (function init() {

        self.$container = document.createElement('div');
        self.$container.setAttribute('class', 'dialogue-box');
        self.$container.setAttribute('style', 'position: absolute');

        $arrow = document.createElement('div');
        $arrow.setAttribute('class', 'dialogue-arrow');
        $arrow.setAttribute('style', 'position: absolute');
    })();
}