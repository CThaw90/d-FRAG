/**
 * Created by christhaw on 2/4/16.
 */
define('dialogue', ['exports', 'constants', 'utility', 'stage'], function (dialogue, constants, utility, stage) {

    dialogue.box = function (object) {

        var api = this;
        var self = {
            container: document.createElement('div'),
            parent: stage.element(),
            displayed: false,
            arrow: null
        };

        api.show = function (message) {
            if (self.displayed) api.hide();
            self.container.innerText = message;
            self.container.textContent = message;
            self.parent.appendChild(self.container);
            self.parent.appendChild(self.arrow);

            var containerDimensions = self.container.getBoundingClientRect(),
                arrowDimensions = self.arrow.getBoundingClientRect();

            self.container.style.left = (object.x + (object.width / 2) - (containerDimensions.width / 2)) + 'px';
            self.container.style.top = (object.y + object.height + 15) + 'px';

            self.arrow.style.left = (object.x + (object.width / 2) - (arrowDimensions.width / 2)) + 'px';
            self.arrow.style.top = (object.y + object.height + 5) + 'px';

            self.displayed = true;
        };

        api.hide = function () {
            if (!self.displayed) return;

            self.parent.removeChild(self.container);
            self.parent.removeChild(self.arrow);
            self.displayed = false;
        };

        api.isDisplayed = function () {
            return self.displayed;
        };

        api.returnSelf = function () {
            return self;
        };

        self.container.setAttribute('class', 'dialogue-box');
        self.container.setAttribute('style', 'position: absolute');
        self.container.setAttribute('id', 'dialogue-box-for-' + object.id);

        self.arrow = document.createElement('div');
        self.arrow.setAttribute('class', 'dialogue-arrow');
        self.arrow.setAttribute('style', 'position: absolute');
        self.arrow.setAttribute('id', 'dialogue-arrow-for-' + object.id);
    };

    dialogue.conversation = function (entities, conversation) {

        var api = this;
        var self = {
            conversation: {
                objectId: String()
            },
            randomSeed: 100000,
            conversing: false,
            objects: {},
            index: 0,
            id: ''
        };

        self.conversation = conversation;
        self.objects = entities;
        if (utility.isArray(entities)) {
            self.objects = utility.arrayToObject(entities);
        }
        self.checkStatus = function () {
            if (self.index === conversation.length) {
                api.end();
            }
        };

        self.validateConversation = function (conversation) {
            var validated = false;
            if (utility.isArray(conversation)) {
                validated = conversation.length > 0;
                for (var i=0; i < conversation.length && validated; i++) {
                    validated = self.validateConversation(conversation[i]);
                }
            }
            else if (utility.isObject(conversation)) {
                validated = self.objects[conversation.objectId] !== undefined && utility.isString(conversation.text);
            }

            return validated;
        };

        api.converse = function (withObjects, withConversation) {

            conversation = conversation || withConversation;
            entities = entities || withObjects;

            if (utility.isArray(entities)) {
                self.objects = utility.arrayToObject(entities);
            }
            else if (utility.isObject(entities) && entities.id) {
                self.objects[entities.id] = entities;
            }
            else if (utility.isObject(entities)) {
                self.objects = entities;
            }
            else {
                return;
            }

            if (utility.isArray(conversation)) {
                self.id = 'conversation_' + Math.floor(Math.random() * self.randomSeed);
                self.conversing = self.validateConversation(conversation);
            }
            else if (utility.isObject(conversation) && utility.isArray(conversation.conversation)) {
                self.id = conversation.id ? conversation.id : 'conversation_' + Math.floor(Math.random() * self.randomSeed);
                self.conversing = self.validateConversation(conversation.conversation);
                conversation = conversation.conversation;
            }
            else if (utility.isObject(conversation)) {
                self.id = 'conversation_' + Math.floor(Math.random() * self.randomSeed);
                self.conversing = self.validateConversation(conversation);
                conversation = [conversation];
            }
        };

        api.conversing = function () {
            return self.conversing;
        };

        api.end = function () {
            self.objects[conversation[self.index > 0 ? self.index - 1 : 0].objectId].quiet();
            self.conversing = false;
            self.index = 0;
        };

        api.next = function () {
            self.checkStatus();
            if (api.conversing()) {
                self.objects[conversation[self.index > 0 ? self.index - 1 : 0].objectId].quiet();
                self.objects[conversation[self.index].objectId].talk(conversation[self.index].text);
                self.index++;
            }
        };

        api.restart = function () {
            self.index = 0;
        };

        api.setIndex = function (index) {
            if (utility.isNumber(index)) {
                self.objects[conversation[self.index > 0 ? self.index - 1 : 0].objectId].quiet();
                self.index = index;
            }
        };

        api.returnSelf = function () {
            return self;
        }
    };
});
