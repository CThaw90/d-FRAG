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
        CDSObj.objects[object.id] = object;
        CDSObj.events[object.id] = [];
        setVectorCoordinates(object);
    };

    // Removes a collision object from the Collision Detection System
    self.remove = function(id) {
        delete CDSObj.objects[id];
        delete CDSObj.events[id];
        // Need to figure out proper logic to remove all vector coordinates
        // associated with the id from the vector table
    };

    /**
     * @description checks movement space for a possible collision.
     * If an eminent collision is detected within range of the object movement
     * space remaining in pixels between the object and collision vector is returned
     * @param pos - the coordinates in which an object entity is currently located
     * @param dir - the direction in which an object entity is going to move
     * @param range - the movement space of an object entity per frameRate
     */
    self.check = function(pos, dir, range) {
        var status = false, axis = null, tmp = range;
        pos.x = parseInt(pos.x);
        pos.y = parseInt(pos.y);

        while (tmp > 0 && !status) {

            switch (dir) {
                case _const.faceDown:
                case _const.faceUp:
                    axis = 'y';
                    break;
                case _const.faceLeft:
                case _const.faceRight:
                    axis = 'x';
                    break;
                default:
                    console.log('Huge Error');
                    return;
            }

            switch (dir) {
                case _const.faceDown:
                case _const.faceRight:
                    pos[axis]++;
                    break;
                case _const.faceUp:
                case _const.faceLeft:
                    pos[axis]--;
                    break;
                default:
                    console.log('Huge Error');
                    return;
            }

            if (CDSObj.vector[axis][pos[axis]]) {
                var vector = CDSObj.vector[axis][pos[axis]];
                if (vector.start < pos[reverse(axis)] && vector.end > pos[reverse(axis)]) {
                    // Might use logic to dynamically remove stale vector coordinates who's
                    // object might have been removed prior to the collision event
                    status = {vector: pos[axis], collisionId: vector.id};
                    CDSObj.events[vector.id].push(new Date().getTime());
                }
            }

            tmp--;
        }

        return status;
    };

    function setVectorCoordinates(object) {

        // Damn Javascript returns null as a number. Have to figure out a clean work around
        if (isNaN(object.width) || isNaN(object.height) || isNaN(object.x) || isNaN(object.y)) { return; }

        // Round up coordinates to the nearest whole number to handle consistency and precision
        // Also might wanna check to see if a collision vector overlaps another collision vector
        // Will probably implement these in a later release
        var end = (parseInt(object.y) + parseInt(object.height));

        // The collision vector straight down : LEFT_SIDE
        // CDSObj.vector.x = {bound: parseInt(object.x), start: parseInt(object.y), end: end};
        CDSObj.vector.x[parseInt(object.x)] = {start: parseInt(object.y), end: end, id: object.id};

        // The collision vector straight down : RIGHT_SIDE
        // CDSObj.vector.x = {bound: (parseInt(object.x) + parseInt(object.width)), start: parseInt(object.y), end: end};
        CDSObj.vector.x[(parseInt(object.x) + parseInt(object.width))] = {start: parseInt(object.y), end: end, id: object.id};

        end = (parseInt(object.x) + parseInt(object.width));

        // The collision vector straight across : TOP_SIDE
        // CDSObj.vector.y = {bound: parseInt(object.y), start: parseInt(object.x), end: end};
        CDSObj.vector.y[parseInt(object.y)] = {start: parseInt(object.y), end: end, id: object.id};

        // The collision vector straight across : BOTTOM_SIDE
        // CDSObj.vector.y = {bound: (parseInt(object.y) + parseInt(object.height)), start: parseInt(object.x), end: end};
        CDSObj.vector.y[(parseInt(object.y) + parseInt(object.height))] = {start: parseInt(object.x), end: end, id: object.id};
    }

    function reverse(axis) {
        var invert = {x: 'y', y: 'x'};
        return invert[axis];
    }
}