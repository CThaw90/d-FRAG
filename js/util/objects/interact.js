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

    self.add = function(interaction) {
        if (!interaction.id) {
            console.log('Cannot add interaction. No interaction id specified');
            return;
        }

        console.log('Adding interaction with id ' + interaction.id);

        //interactions[interaction.id]
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

    document.addEventListener(_const.keyPress, function(event) {
        console.log(event);
    });

    //document.addEventListener(_const.keyDown, function() {
    //    console.log(interactions);
    //});
}