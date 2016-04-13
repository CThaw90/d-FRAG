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
        var object = CDSObj.objects[id];
        if (object) {
            // Need to figure out proper logic to remove all vector coordinates
            // associated with the id from the vector table
            remove(id, object.x, object.y, object.width, object.height);
            delete CDSObj.objects[id];
            delete CDSObj.events[id];
        }
    };

    /**
     * @description checks movement space for a possible collision.
     * If an eminent collision is detected within range of the object movement
     * space remaining in pixels between the object and collision vector is returned
     * @param pos - the coordinates in which an object entity is currently located
     * @param dir - the direction in which an object entity is going to move
     * @param range - the movement space of an object entity per frameRate
     */
    self.check = function(pos, dimen, dir, range, obj) {
        var status = false, axis = null, tmp = range + 1;
        dimen.x = dimen.height;
        dimen.y = dimen.width;
        pos.x = parseInt(pos.x);
        pos.y = parseInt(pos.y);

        while (tmp > 0 && !status) {

            switch (dir) {
                case _const.down:
                case _const.up:
                    axis = 'y';
                    break;
                case _const.left:
                case _const.right:
                    axis = 'x';
                    break;
                default:
                    console.log('Huge Error');
                    return;
            }

            if (CDSObj.vector[axis][pos[axis]]) {
                var vector = CDSObj.vector[axis][pos[axis]], i = 0;
                for (; i < vector.length && !status; i++ ) {
                    if (vector[i].start < pos[reverse(axis)] && vector[i].end > pos[reverse(axis)] && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // TODO: Fix collision events..i think collision events are broken
                        CDSObj.events[vector[i].id].push(new Date().getTime());
                    }
                    else if (vector[i].start < (pos[reverse(axis)] + dimen[axis]) && vector[i].end > (pos[reverse(axis)] + dimen[axis]) && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // Fix collision events..i think collision events are broken
                        CDSObj.events[vector[i].id].push(new Date().getTime());
                    }
                    else if (vector[i].start > (pos[reverse(axis)]) && vector[i].end < (pos[reverse(axis)] + dimen[axis]) && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // Fix collision events..i think collision events are broken
                        CDSObj.events[vector[i].id].push(new Date().getTime());
                    }

                    else if (vector[i].start === (pos[reverse(axis)]) && vector[i].end === (pos[reverse(axis)] + dimen[axis]) && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // Fix collision events..i think collision events are broken
                        CDSObj.events[vector[i].id].push(new Date().getTime());
                    }
                }
            }

            switch (dir) {
                case _const.down:
                case _const.right:
                    pos[axis]++;
                    break;
                case _const.up:
                case _const.left:
                    pos[axis]--;
                    break;
                default:
                    console.log('Huge Error');
                    return;
            }

            tmp--;
        }

        return status;
    };

    self.exists = function(id) {
        return _util.isObject(CDSObj.objects[id]);
    };

    function setVectorCoordinates(object) {

        // Damn Javascript returns null as a number. Have to figure out a clean work around
        if (isNaN(object.width) || isNaN(object.height) || isNaN(object.x) || isNaN(object.y)) { return; }

        var LEFT_SIDE = parseInt(object.x), RIGHT_SIDE = parseInt(object.x) + parseInt(object.width),
            TOP_SIDE = parseInt(object.y), BOTTOM_SIDE = parseInt(object.y) + parseInt(object.height);
        // Round up coordinates to the nearest whole number to handle consistency and precision
        // Also might wanna check to see if a collision vector overlaps another collision vector
        // Will probably implement these in a later release

        // The collision vector straight down : LEFT_SIDE
        // CDSObj.vector.x[parseInt(object.x)] = [{start: parseInt(object.y), end: end, id: object.id};
        // LEFT_SIDE = parseInt(object.x);
        if (CDSObj.vector.x[LEFT_SIDE]) {
            CDSObj.vector.x[LEFT_SIDE].push({start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id});

        } else {
            CDSObj.vector.x[LEFT_SIDE] = [{start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id}];
        }

        // The collision vector straight down : RIGHT_SIDE
        // CDSObj.vector.x[(parseInt(object.x) + parseInt(object.width))] = {start: parseInt(object.y), end: end, id: object.id};
        // RIGHT_SIDE = parseInt(object.x) + parseInt(object.width);
        if (CDSObj.vector.x[RIGHT_SIDE]) {
            CDSObj.vector.x[RIGHT_SIDE].push({start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id});

        } else {
            CDSObj.vector.x[RIGHT_SIDE] = [{start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id}];
        }

        // The collision vector straight across : TOP_SIDE
        // CDSObj.vector.y[parseInt(object.y)] = {start: parseInt(object.x), end: end, id: object.id};
        if (CDSObj.vector.y[TOP_SIDE]) {
            CDSObj.vector.y[TOP_SIDE].push({start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id});

        } else {
            CDSObj.vector.y[TOP_SIDE] = [{start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id}];
        }

        // The collision vector straight across : BOTTOM_SIDE
        // CDSObj.vector.y[(parseInt(object.y) + parseInt(object.height))] = {start: parseInt(object.x), end: end, id: object.id};
        if (CDSObj.vector.y[BOTTOM_SIDE]) {
            CDSObj.vector.y[BOTTOM_SIDE].push({start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id});

        } else {
            CDSObj.vector.y[BOTTOM_SIDE] = [{start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id}]
        }
    }

    function reverse(axis) {
        var invert = {x: 'y', y: 'x'};
        return invert[axis];
    }

    function remove(id, x, y, width, height) {
        var lVector = CDSObj.vector.x[x], tVector = CDSObj.vector.y[y],
            rVector = CDSObj.vector.x[x + width], bVector = CDSObj.vector.y[y + height], i;

        for (i = 0; lVector.length && i < lVector.length; i++) {
            if (lVector[i].id === id) {
                lVector.splice(i, 1);
            }
        }

        for (i = 0; tVector.length && i < tVector.length; i++) {
            if (tVector[i].id === id) {
                tVector.splice(i, 1);
            }
        }

        for (i = 0; rVector.length && i < rVector.length; i++) {
            if (rVector[i].id === id) {
                rVector.splice(i, 1);
            }
        }

        for (i = 0; bVector.length && i < bVector.length; i++) {
            if (bVector[i].id === id) {
                bVector.splice(i, 1);
            }
        }
    }
}