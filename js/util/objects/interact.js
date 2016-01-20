/**
 * Created by ChrisThaw on 12/3/2015
 *
 * Used to monitor and control interaction between objects
 */
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
        var objectInfo = null;
        if (!interaction.id || !interaction.object || !interaction.trigger) {
            console.error('Cannot add interaction. Incomplete interaction configuration');
            return;
        }

        switch (interaction.type) {

            case _const.movement:

                interactions.mTrigger[interaction.id] = {trigger: interaction.trigger, object: interaction.object};

                objectInfo = interactions.mTrigger[interaction.id];
                objectInfo['snapshot'] = { x: objectInfo['trigger'].x,  y: objectInfo['trigger'].y };
                // Set an interval loop that checks whether the coordinates of the
                // object has changed. If it has the object has moved therefore
                // run the function
                setInterval(function() {

                    if (objectInfo['snapshot'].x !== objectInfo['trigger'].x || objectInfo['snapshot'].y !== objectInfo['trigger'].y
                        || objectInfo['snapshot'].trajecting !== objectInfo['trigger'].trajecting()) {

                        interaction.does(objectInfo['object'], objectInfo['trigger'], cd);

                        objectInfo['snapshot'].trajecting = objectInfo['trigger'].trajecting();
                        objectInfo['snapshot'].x = objectInfo['trigger'].x;
                        objectInfo['snapshot'].y = objectInfo['trigger'].y;

                    }

                }, _const.movementCheckInterval);
                break;

            case _const.keyPress:
                interactions.kTrigger[interaction.id] = {trigger: interaction.trigger, object: interaction.object};

                objectInfo = interactions.kTrigger[interaction.id];
                // Add a listener that listens for the key press and the buttons
                // associated with that action
                addEventListener(_const.keyDown, function(event) {
                    if (keyPressed(event.keyCode, interaction.config.keys)) {
                        interaction.does(objectInfo['object'], objectInfo['trigger'], cd, event);
                    }
                });
                addEventListener(_const.keyUp, function(event) {
                    if (keyPressed(event.keyCode, interaction.config.keys)) {
                        interaction.does(objectInfo['object'], objectInfo['trigger'], cd, event);
                    }
                });
                break;

            default:
                console.error('Invalid interaction type : ' + interaction.type);
                break;
        }
    };

    self.remove = function(id) {

    };

    self.disable = function(id) {

    };

    self.enable = function(id) {

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