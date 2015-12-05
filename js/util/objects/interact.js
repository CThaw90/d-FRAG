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
            kTrigger: {}
        },

        cd = null;

    self.add = function(interaction) {
        if (!interaction.id) return;

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

    document.addEventListener(_const.keyPress, function(event) {
        console.log(event);
    });

    //document.addEventListener(_const.keyDown, function() {
    //    console.log(interactions);
    //});
}