/**
 * Created by christhaw on 10/26/15.
 */
define('collision', ['exports', 'constants', 'utility', 'debug'], function (collision, constants, utility, debug) {

    var self = {
        // The Collision Detection System Object
        // The complex object that keeps track of all collision events
        // and possibilities through out the run of a single game
        CDSObj: {
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
        }
    };

    self.setVectorCoordinates = function (object) {

        // Damn Javascript returns null as a number. Have to figure out a clean work around
        if (window.isNaN(object.width) || window.isNaN(object.height) || window.isNaN(object.x) || window.isNaN(object.y)) { return; }

        var LEFT_SIDE = parseInt(object.x), RIGHT_SIDE = parseInt(object.x) + parseInt(object.width),
            TOP_SIDE = parseInt(object.y), BOTTOM_SIDE = parseInt(object.y) + parseInt(object.height);
        // Round up coordinates to the nearest whole number to handle consistency and precision
        // Also might wanna check to see if a collision vector overlaps another collision vector
        // Will probably implement these in a later release

        // The collision vector straight down : LEFT_SIDE
        // CDSObj.vector.x[parseInt(object.x)] = [{start: parseInt(object.y), end: end, id: object.id};
        // LEFT_SIDE = parseInt(object.x);
        if (self.CDSObj.vector.x[LEFT_SIDE]) {
            self.CDSObj.vector.x[LEFT_SIDE].push({start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id});

        } else {
            self.CDSObj.vector.x[LEFT_SIDE] = [{start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id}];
        }

        // The collision vector straight down : RIGHT_SIDE
        // CDSObj.vector.x[(parseInt(object.x) + parseInt(object.width))] = {start: parseInt(object.y), end: end, id: object.id};
        // RIGHT_SIDE = parseInt(object.x) + parseInt(object.width);
        if (self.CDSObj.vector.x[RIGHT_SIDE]) {
            self.CDSObj.vector.x[RIGHT_SIDE].push({start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id});

        } else {
            self.CDSObj.vector.x[RIGHT_SIDE] = [{start: TOP_SIDE, end: BOTTOM_SIDE, id: object.id}];
        }

        // The collision vector straight across : TOP_SIDE
        // CDSObj.vector.y[parseInt(object.y)] = {start: parseInt(object.x), end: end, id: object.id};
        if (self.CDSObj.vector.y[TOP_SIDE]) {
            self.CDSObj.vector.y[TOP_SIDE].push({start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id});

        } else {
            self.CDSObj.vector.y[TOP_SIDE] = [{start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id}];
        }

        // The collision vector straight across : BOTTOM_SIDE
        // CDSObj.vector.y[(parseInt(object.y) + parseInt(object.height))] = {start: parseInt(object.x), end: end, id: object.id};
        if (self.CDSObj.vector.y[BOTTOM_SIDE]) {
            self.CDSObj.vector.y[BOTTOM_SIDE].push({start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id});

        } else {
            self.CDSObj.vector.y[BOTTOM_SIDE] = [{start: LEFT_SIDE, end: RIGHT_SIDE, id: object.id}]
        }
    };

    self.reverse = function (axis) {
        var invert = {x: 'y', y: 'x'};
        return invert[axis];
    };

    self.remove = function  (id, x, y, width, height) {
        var lVector = self.CDSObj.vector.x[x], tVector = self.CDSObj.vector.y[y],
            rVector = self.CDSObj.vector.x[x + width], bVector = self.CDSObj.vector.y[y + height], i;

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
    };

    collision.add = function (object) {
        self.CDSObj.objects[object.id] = object;
        self.CDSObj.events[object.id] = [];
        self.setVectorCoordinates(object);
    };

    /**
     * @description checks movement space for a possible collision.
     * If an eminent collision is detected within range of the object movement
     * space remaining in pixels between the object and collision vector is returned
     * @param pos - the coordinates in which an object entity is currently located
     * @param dimen - the dimensions of the object by pixel height and width
     * @param dir - the direction in which an object entity is going to move
     * @param range - the movement space of an object entity per frameRate
     * @param obj - a reference to the object for relational information
     */
    /* TODO: Fix so that width and height are calculated within collision check
    *  New api version will only require the entity object to be passed in
    * */
    collision.check = function (pos, dimen, dir, range, obj) {
        var status = false, axis = null, tmp = range + 1;
        dimen.y = dimen.height;
        dimen.x = dimen.width;
        pos.x = parseInt(pos.x);
        pos.y = parseInt(pos.y);

        while (tmp > 0 && !status) {

            switch (dir) {
                case constants.down:
                case constants.up:
                    axis = 'y';
                    break;
                case constants.left:
                case constants.right:
                    axis = 'x';
                    break;
                default:
                    debug.error('Huge Error');
                    return;
            }

            if (self.CDSObj.vector[axis][pos[axis]]) {
                var vector = self.CDSObj.vector[axis][pos[axis]], i = 0;
                for (; i < vector.length && !status; i++ ) {
                    if (vector[i].start < pos[self.reverse(axis)] && vector[i].end > pos[self.reverse(axis)] && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // TODO: Fix collision events..i think collision events are broken
                        self.CDSObj.events[vector[i].id].push(new Date().getTime());
                    }
                    else if (vector[i].start < (pos[self.reverse(axis)] + dimen[self.reverse(axis)]) && vector[i].end > (pos[self.reverse(axis)] + dimen[self.reverse(axis)]) && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // Fix collision events..i think collision events are broken
                        self.CDSObj.events[vector[i].id].push(new Date().getTime());
                    }
                    else if (vector[i].start > (pos[self.reverse(axis)]) && vector[i].end < (pos[self.reverse(axis)] + dimen[self.reverse(axis)]) && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // Fix collision events..i think collision events are broken
                        self.CDSObj.events[vector[i].id].push(new Date().getTime());
                    }

                    else if (vector[i].start === (pos[self.reverse(axis)]) && vector[i].end === (pos[self.reverse(axis)] + dimen[self.reverse(axis)]) && obj.id !== vector[i].id) {
                        // Might use logic to dynamically remove stale vector coordinates who's
                        // object might have been removed prior to the collision event
                        status = {vector: pos[axis], collisionId: vector[i].id};

                        // Fix collision events..i think collision events are broken
                        self.CDSObj.events[vector[i].id].push(new Date().getTime());
                    }
                }
            }

            switch (dir) {
                case constants.down:
                case constants.right:
                    pos[axis]++;
                    break;
                case constants.up:
                case constants.left:
                    pos[axis]--;
                    break;
                default:
                    debug.error('Huge Error');
                    return;
            }

            tmp--;
        }

        return status;
    };

    collision.exists = function (id) {
        return utility.isObject(self.CDSObj.objects[id]);
    };

    collision.remove = function (id) {
        var object = self.CDSObj.objects[id];
        if (object) {
            self.remove(id, object.x, object.y, object.width, object.height);
            delete self.CDSObj.objects[id];
            delete self.CDSObj.events[id];
        }
    };

    collision.returnSelf = function () {
        return self;
    };
});