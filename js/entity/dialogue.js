/**
 *
 * Created by ChrisThaw 01/28/2016
 *
 * A text dialogue object used to represent communication
 * between objects and other game entities.
 *
 * */
function DialogueBox(entity) {

    var self = this, $arrow, displayed = false, entity = entity;

    self.show = function(text) {
        console.log(entity.id + ' says: ' + text);
        self.$container.style.top = entity.y + 'px';
        self.$container.style.left = entity.x + 'px';
        // TODO: Put this in functions to make a consistent call across all browsers
        self.$container.innerText = text;
        self.$container.textContent = text;
        entity.$container.parentNode.appendChild(self.$container);
        displayed = true;
    };

    self.remove = function() {
        console.log(entity.id + ' stopped talking');
        entity.$container.parentNode.removeChild(self.$container);
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