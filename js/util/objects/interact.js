/**
 * Created by ChrisThaw on 12/3/2015
 *
 * Used to monitor and control interaction between objects
 */
define('interact', ['exports', 'constants', 'utility', 'collision', 'interactions'], function (interact, constants, utility, collision, interactions) {

    var self = {
        // Triggered by movement
        mTrigger: {},

        // Triggered by a keypress
        kTrigger: {},

        // Information on all trigger configurations
        info: {}
    };
});
function Interactivity() {

    var self = this,

        interactions = {
            // Triggered by movement
            mTrigger: {},

            // Triggered by a keypress
            kTrigger: {},

            // Information on all trigger configurations
            info: {}
        },

        cd = null;

    /**
     * @param interaction
     * @attribute id - Unique identifier for each interaction module
     * @attribute object - the unique identifier used to grab the interacting object
     * @attribute trigger - the unique identifier used to grab the object that triggers interaction
     * @attribute type - the type of action that triggers an interaction or interaction check
     * @attribute config - Extra configurations used to determine where this interaction is allowed to happen
     *
     *      @param config : for keypress type
     *      @attribute keys: [] - An array of key codes that are valid for the interaction
     *      @attribute all: Interaction is triggered for all keys. Can be configured down to a specific subset
     *          @attribute alpha: Only triggered by keys that are letters
     *          @attribute alphaNum: Triggered by keys that are letters or numbers
     *          @attribute movement: Triggered by keys that control the objects movement
     *          @attribute special: Triggered by modifying keys (shift, enter, control, alt, escape etc)
     *          @attribute <none> : All keys are triggers
     *
     * @attribute does - A function that determines what happens when an interaction has been triggered
     */
    self.add = function(interaction) {
        var objectInfo = {}, objects = [];
        if (!interaction.id) {
            console.error('Cannot add interaction. Incomplete interaction configuration');
            return;
        }

        switch (interaction.type) {

            case _const.movement:

                interactions.mTrigger[interaction.id] = interaction.objects;
                // TODO: Place useful information about the interaction event. Store handle object
                interactions.info[interaction.id] = {active: interaction.active || false};

                objects = interactions.mTrigger[interaction.id];

                objectInfo['trigger'] = interaction.trigger;
                objectInfo['snapshot'] = { x: objectInfo['trigger'].x,  y: objectInfo['trigger'].y };
                // Set an interval loop that checks whether the coordinates of the
                // object has changed. If it has the object has moved therefore
                // run the function
                interactions.info[interaction.id]['type'] = _const.movement;
                interactions.info[interaction.id]['interval'] = setInterval(function() {

                    if ((objectInfo['snapshot'].x !== objectInfo['trigger'].x || objectInfo['snapshot'].y !== objectInfo['trigger'].y
                        || objectInfo['snapshot'].trajecting !== objectInfo['trigger'].trajecting()) && interactions.info[interaction.id].active) {

                        interaction.does(self, objectInfo['trigger'], objects, cd);

                        objectInfo['snapshot'].trajecting = objectInfo['trigger'].trajecting();
                        objectInfo['snapshot'].x = objectInfo['trigger'].x;
                        objectInfo['snapshot'].y = objectInfo['trigger'].y;

                    }

                }, _const.movementCheckInterval);
                break;

            case _const.keyPress:
                interactions.kTrigger[interaction.id] = interaction.objects;
                // TODO: Place useful information about the interaction event. Store handle object
                interactions.info[interaction.id] = {active: interaction.active || false};

                objects = interactions.kTrigger[interaction.id];
                // Add a listener that listens for the key press and the buttons
                // associated with that action
                interactions.info[interaction.id]['type'] = _const.keyPress;
                interactions.info[interaction.id]['listener'] = function(event) {
                    if (keyPressed(event.keyCode, interaction.config.keys) && interactions.info[interaction.id].active) {
                        interaction.does(self, objects, cd, event);
                    }
                };
                addEventListener(_const.keyDown, interactions.info[interaction.id]['listener'], false);
                addEventListener(_const.keyUp, interactions.info[interaction.id]['listener'], false);
                break;

            default:
                console.error('Invalid interaction type : ' + interaction.type);
                break;
        }
    };

    self.info = function(id) {
        return interactions.info[id];
    };

    self.remove = function(id) {
        if (!interactions.info[id]) return;
        if (interactions.info[id].type === _const.movement) {
            clearInterval(interactions.info[id].interval);
            delete interactions.mTrigger[id];
            delete interactions.info[id];

        } else if (interactions.info[id].type === _const.keyPress) {
            removeEventListener(_const.keyDown, interactions.info[id]['listener'], false);
            removeEventListener(_const.keyUp, interactions.info[id]['listener'], false);
            delete interactions.kTrigger[id];
            delete interactions.info[id];
        }
    };

    self.disable = function(id) {
        if (_util.isObject(interactions.info[id])) {
            interactions.info[id].active = false;
        } else if (_util.isArray(id)) {
            var i = 0;
            for (; i < id.length; i++) {
                self.disable(id[i]);
            }
        }
    };

    self.whiteListDisable = function(ids) {

        if (_util.isObject(ids)) {
            for (var key in interactions.info) {
                if (!ids[key]) {
                    self.disable(key);
                }
            }
        }
        else if (_util.isArray(ids)) {
            self.whiteListDisable(_util.arrayToObject(ids, true));
        }
        else if (_util.isString(ids)) {
            var o = {};
            o[ids] = true;
            self.whiteListDisable(o);
        }
    };

    self.disableAll = function() {
        for (var key in interactions.info) {
            if (interactions.info.hasOwnProperty(key)) {
                self.disable(key);
            }
        }
    };

    self.enable = function(id) {
        if (_util.isObject(interactions.info[id])) {
            interactions.info[id].active = true;
        }
    };

    self.blackListEnable = function(ids) {

        if (_util.isObject(ids)) {
            for (var key in interactions.info) {
                if (!ids[key]) {
                    self.enable(key);
                }
            }
        }
        else if (_util.isArray(ids)) {
            self.blackListEnable(_util.arrayToObject(ids, false));
        }
        else if (_util.isString(ids)) {
            var o = {};
            o[ids] = true;
            self.blackListEnable(o);
        }
    };

    self.enableAll = function() {
        for (var key in interactions.info) {
            if (interactions.info.hasOwnProperty(key)) {
                self.enable(key);
            }

        }
    };

    self.detector = function(collision) {
        cd = collision;
    };

    function keyPressed(key, keys) {
        var i = 0, keyFound = false;
        if (_util.isArray(keys)) {
            for (i = 0; i < keys.length && !keyFound; i++) {
                keyFound = (_util.isString ? _const.keyMap[keys[i]] === key : false);
            }
        }

        return keyFound;
    }
}