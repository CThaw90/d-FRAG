/**
 * Created by ChrisThaw on 12/3/2015
 *
 * Used to monitor and control interaction between objects
 */
define('interact', ['exports', 'constants', 'utility', 'collision', 'interactions', 'stage'], function (interact, constants, utility, collision, interactions, stage) {

    var self = {
        // Triggered by movement
        mTrigger: {},

        // Triggered by a keypress
        kTrigger: {},

        // Information on all trigger configurations
        info: {}
    };

    self.populateObjects = function (ids) {
        var o = {};
        if (ids && utility.isArray(ids)) {
            ids.forEach(function (id) {
                if (utility.isString(id)) {
                    o[id] = stage.getObject(id);
                }
            });
        }

        return o;
    };

    self.keyPressed = function (key, keys) {
        var keyFound = false, i = 0;
        if (utility.isArray(keys)) {
            for (; i < keys.length && !keyFound; i++) {
                keyFound = (utility.isString(keys[i]) ? constants.keyMap[keys[i]] === key : false);
            }
        }

        return keyFound;
    };

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
    interact.add = function (interaction) {
        var objectInfo = {}, objects = [];
        if (!interaction.id) {
            console.error('Cannot add interaction. Incomplete interaction configuration');
            return;
        }

        switch (interaction.type) {

            case constants.movement:

                self.mTrigger[interaction.id] = self.populateObjects(interaction.objects);
                // TODO: Place useful information about the interaction event. Store handle object
                self.info[interaction.id] = {active: interaction.active || false};

                objects = self.mTrigger[interaction.id];

                objectInfo.trigger = stage.getObject(interaction.trigger);
                objectInfo.snapshot = {x: objectInfo.trigger.x, y: objectInfo.trigger.y};
                // Set an interval loop that checks whether the coordinates of the
                // object has changed. If it has the object has moved therefore
                // run the function
                self.info[interaction.id].type = constants.movement;
                self.info[interaction.id].interval = setInterval(function () {

                    if ((objectInfo.snapshot.x !== objectInfo.trigger.x || objectInfo.snapshot.y !== objectInfo.trigger.y
                        || objectInfo.snapshot.trajecting !== objectInfo.trigger.trajecting()) && self.info[interaction.id].active) {

                        interaction.does(interact, objectInfo.trigger, objects, collision);

                        objectInfo.snapshot.trajecting = objectInfo.trigger.trajecting();
                        objectInfo.snapshot.x = objectInfo.trigger.x;
                        objectInfo.snapshot.y = objectInfo.trigger.y;
                    }
                }, constants.movementCheckInterval);
                break;

            case constants.keyPress:
                self.kTrigger[interaction.id] = self.populateObjects(interaction.objects);
                // TODO: Place useful information about the interaction event. Store handle object
                self.info[interaction.id] = {active: interaction.active || false};

                objects = self.kTrigger[interaction.id];
                // Add a listener that listens for the key press and the buttons
                // associated with that action
                self.info[interaction.id].type = constants.keyPress;
                self.info[interaction.id].listener = function (event) {
                    if (self.keyPressed(event.keyCode, interaction.config.keys) && self.info[interaction.id].active) {
                        interaction.does(interact, objects, collision, event);
                    }
                };
                addEventListener(constants.keyDown, self.info[interaction.id].listener, false);
                addEventListener(constants.keyUp, self.info[interaction.id].listener, false);
                break;

            default:
                console.error('Invalid interaction type : ' + interaction.type);
                break;
        }
    };

    interact.info = function (id) {
        return self.info[id];
    };

    interact.remove = function (id) {
        if (self.info[id]) return;
        if (self.info[id].type === constants.movement) {
            clearInterval(self.info[id].interval);
            delete self.mTrigger[id];
            delete self.info[id];
        }
        else if (self.info[id].type === constants.keyPress) {
            removeEventListener(constants.keyDown, self.info[id].listener, false);
            removeEventListener(constants.keyUp, self.info[id].listener, false);
            delete self.kTrigger[id];
            delete self.info[id];
        }
    };

    interact.disable = function (id) {
        if (utility.isObject(self.info[id])) {
            self.info[id].active = false;
        }
        else if (utility.isArray(id)) {
            id.forEach(function (i) {
                interact.disable(i);
            });
        }
    };

    interact.whiteListDisable = function (ids) {
        if (utility.isObject(ids)) {
            for (var key in self.info) {
                if (self.info.hasOwnProperty(key) && !ids[key]) {
                    interact.disable(key);
                }
            }
        }
        else if (utility.isArray(ids)) {
            interact.whiteListDisable(utility.arrayToObject(ids, true));
        }
        else if (utility.isString(ids)) {
            var o = {};
            o[ids] = true;
            interact.whiteListDisable(o);
        }
    };

    interact.disableAll = function () {
        for (var key in self.info) {
            if (self.info.hasOwnProperty(key)) {
                self.disable(key);
            }
        }
    };

    interact.enable = function (id) {
        if (utility.isObject(self.info[id])) {
            self.info[id].active = true;
        }
    };

    interact.blackListEnable = function (ids) {

        if (utility.isObject(ids)) {
            for (var key in self.info) {
                if (self.info.hasOwnProperty(key) && !ids[key]) {
                    interact.enable(key);
                }
            }
        }
        else if (utility.isArray(ids)) {
            interact.blackListEnable(utility.arrayToObject(ids, false));
        }
        else if (utility.isString(ids)) {
            var o = {};
            o[ids] = true;
            interact.blackListEnable(ids);
        }
    };

    interact.enableAll = function () {
        for (var key in self.info) {
            if (self.info.hasOwnProperty(key)) {
                interact.enable(key);
            }
        }
    };

    interact.returnSelf = function () {
        return self;
    };

    // Initialize interactions
    interact.init = function () {
        for (var key in interactions) {
            if (interactions.hasOwnProperty(key)) {
                interactions[key].id = key;
                interact.add(interactions[key]);
            }
        }
    };
});