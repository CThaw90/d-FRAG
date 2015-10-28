/**
 * Created by Chris on 10/27/2015.
 */
/**
 * Created by christhaw on 10/26/15.
 */

function Collision() {

    var self = this;

    // The Collision Detection System Object
    // The complex object that keeps track of all collision events
    // and possibilities through out the run of a single game
    var CDSObj = {
        // A table of all collision enabled objects
        // Key value is a uniqueId referencing the object
        objects: {},

        // A table of all collision events that have taken place
        // Key value is a uniqueId referencing the object that triggered the event
        events: {},

        // A table of the coordinates of all possible collisions
        // Information/Reminder on how the collision vector works:
        // Every collision side of an object has 3 vector entries
        // (two x values and a y value or two y values and an x value)
        // Every object movement has to check the range of framePixels
        // in a given direction to test for collisions.

        // If a collision vector is within the range of movement the
        // allowed remaining pixel space is returned before the object
        // is halted.
        vector: {x: {}, y: {}}
    };

    // Adds a new collision object to the Collision Detection System
    self.add = function(object) {
        console.log('Adding stage with id: '+object.id);
        CDSObj.objects[object.id] = object;
        CDSObj.events[object.id] = [];
        setVectorCoordinates(object);
    };

    // Removes a collision object from the Collision Detection System
    self.remove = function(id) {

    };

    function setVectorCoordinates(objects) {
        var bounds = objects.$container.getBoundingClientRect();
    }
}