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
        self.$container.innerText = text;
        self.$container.textContent = text;
        entity.$container.parentNode.appendChild(self.$container);
        var containerRect = self.$container.getBoundingClientRect();
        self.$container.style.left = (entity.x + (entity.width / 2) - (containerRect.width /2)) + 'px';
        self.$container.style.top = (entity.y + entity.height + 15) + 'px';

        entity.$container.parentNode.appendChild($arrow);
        var arrowRect = $arrow.getBoundingClientRect();
        $arrow.style.left = (entity.x + (entity.width / 2) - (arrowRect.width / 2)) + 'px';
        $arrow.style.top = (entity.y + entity.height + 5) + 'px';

        // TODO: Put this in functions to make a consistent call across all browsers
        displayed = true;
    };

    self.remove = function() {
        if (!displayed) return;

        entity.$container.parentNode.removeChild(self.$container);
        entity.$container.parentNode.removeChild($arrow);
        displayed = false;
    };

    self.isDisplayed = function() {
        return displayed;
    };

    (function init() {

        self.$container = document.createElement('div');
        self.$container.setAttribute('class', 'dialogue-box');
        self.$container.setAttribute('style', 'position: absolute');
        self.$container.setAttribute('id', 'dialogue-box-for-'+entity.id);

        $arrow = document.createElement('div');
        $arrow.setAttribute('class', 'dialogue-arrow');
        $arrow.setAttribute('style', 'position: absolute');
        $arrow.setAttribute('id', 'dialogue-arrow-for-'+entity.id);
    })();
}