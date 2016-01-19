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
     *      @param config : for movement type
     *      @attribute all: N - Interaction is triggered on all spaces N pixels away from the interacting object
     *      @attribute up: N - Interaction is triggered over top and within N pixels away from the interacting object
     *      @attribute down: N - Interaction is triggered under and within N pixels away from the interacting object
     *      @attribute left: N - Interaction is triggered to the left and within N pixels away from the interacting object
     *      @attribute right: N - Interaction is triggered to the right and within N pixels away from the interacting object
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
        if (!interaction.id || !interaction.object || !interaction.trigger) {
            console.error('Cannot add interaction. Incomplete interaction configuration');
            return;
        }

        interactions.mTrigger[interaction.id] = {
            trigger: interaction.trigger,
            object: interaction.object
        };
        switch (interaction.type) {

            case _const.movement:
                var objectInfo = interactions.mTrigger[interaction.id];
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
                // Add a listener that listens for the key press and the buttons
                // associated with that action
                addEventListener(_const.keyPress, function() {

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


    function delegate(event) {

    }

    function search(interation) {

    }
}