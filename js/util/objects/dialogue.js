/**
 * Created by christhaw on 2/4/16.
 */
function Dialogue() {

    var self = this, conversing = false, objects, conversation, index = 0, RANDOM_ID_SEED = 10000;
    self.id = 'conversation_object_initialized';
    self.converse = function (withObjects, withConversation) {

        objects = {};
        if (_util.isArray(withObjects)) {
            objects = _util.arrayToObject(withObjects);
        }
        else if (_util.isObject(withObjects) && withObjects.id) {
            objects[withObjects.id] = withObjects;
        }
        else if (_util.isObject(withObjects)) {
            objects = withObjects;
        }
        else {
            return;
        }

        if (_util.isArray(withConversation)) {
            self.id = 'conversation_' + Math.floor(Math.random() * RANDOM_ID_SEED);
            conversing = validateConversation(withObjects, withConversation);
            conversation = withConversation;
        }
        else if (_util.isObject(withConversation) && _util.isArray(withConversation['conversation'])) {
            self.id = withConversation.id ? withConversation.id : 'conversation_' + Math.floor(Math.random() * RANDOM_ID_SEED);
            conversing = validateConversation(withConversation['conversation']);
            conversation = withConversation['conversation'];
        }
        else if (_util.isObject(withConversation)) {
            self.id = 'conversation_' + Math.floor(Math.random() * RANDOM_ID_SEED);
            conversing = validateConversation(withConversation);
            conversation = [withConversation];
        }
        else {
            return;
        }
    };

    self.conversing = function() {
        return conversing;
    };

    self.restart = function() {
        index = 0;
    };

    self.next = function() {
        checkStatus();
        if (conversing) {
            objects[conversation[index > 0 ? index - 1 : 0]['objectId']].quiet();
            objects[conversation[index]['objectId']].talk(conversation[index].text);
            index++;
        }
    };

    self.end = function() {
        objects[conversation[index > 0 ? index - 1 : 0]['objectId']].quiet();
        conversation = [];
        conversing = false;
        objects = {};
        index = 0;
    };

    function validateConversation(conversation) {
        var validated = false;
        if (_util.isArray(conversation)) {
            validated = conversation.length > 0;
            for (var i=0; i < conversation.length && validated; i++) {
                validated = validateConversation(conversation[i]);
            }
        }
        else if (_util.isObject(conversation)) {
            validated = !(!objects[conversation['objectId']] || !conversation.text);
        }

        return validated;
    }

    function checkStatus() {
        if ((index === conversation.length)) {
            self.end();
        }
    }
}
