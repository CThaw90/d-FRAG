/**
 * Created by Chris on 7/20/2016.
 */
define(['collision'], function (collision) {
    /* globals describe, it, xit, jasmine, spyOn beforeEach */
    describe('Game collision detection module', function () {

        it('should be a valid object', function () {
            expect(collision).toEqual(jasmine.any(Object));
        });

        it('should add a collision object and set collision vectors', function () {
            var object = {id: 'TestingAddCollisionObject', height: 100, width: 100, x: 100, y: 100};
            collision.add(object);

            var self = collision.returnSelf();

            expect(self.CDSObj.objects[object.id]).toBe(object);
            expect(self.CDSObj.events[object.id]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.x[10]).not.toEqual(jasmine.any(Array));

            // Checking the LEFT_SIDE
            expect(self.CDSObj.vector.x[100]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.x[100][0]).toEqual(jasmine.any(Object));
            expect(self.CDSObj.vector.x[100][0].start).toEqual(100);
            expect(self.CDSObj.vector.x[100][0].end).toEqual(200);
            expect(self.CDSObj.vector.x[100][0].id).toEqual('TestingAddCollisionObject');

            // Checking the RIGHT_SIDE
            expect(self.CDSObj.vector.x[200]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.x[200][0]).toEqual(jasmine.any(Object));
            expect(self.CDSObj.vector.x[200][0].start).toEqual(100);
            expect(self.CDSObj.vector.x[200][0].end).toEqual(200);
            expect(self.CDSObj.vector.x[200][0].id).toEqual('TestingAddCollisionObject');

            // Checking the TOP_SIDE
            expect(self.CDSObj.vector.y[100]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.y[100][0]).toEqual(jasmine.any(Object));
            expect(self.CDSObj.vector.y[100][0].start).toEqual(100);
            expect(self.CDSObj.vector.y[100][0].end).toEqual(200);
            expect(self.CDSObj.vector.y[100][0].id).toEqual('TestingAddCollisionObject');

            // Checking the BOTTOM_SIDE
            expect(self.CDSObj.vector.y[200]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.y[200][0]).toEqual(jasmine.any(Object));
            expect(self.CDSObj.vector.y[200][0].start).toEqual(100);
            expect(self.CDSObj.vector.y[200][0].end).toEqual(200);
            expect(self.CDSObj.vector.y[200][0].id).toEqual('TestingAddCollisionObject');
        });

        it('should check for collisions and return collision vectors on detection', function () {
            var object1 = {id: 'Object1', height: 200, width: 200, x: 340, y: 300},
                object2 = {id: 'Object2', height: 100, width: 100, x: 120, y: 400},
                object3 = {id: 'Object3', height: 200, width: 100, x: 500, y: 500};

            collision.add(object1);
            collision.add(object2);
            collision.add(object3);

            expect(collision.check({x: 90, y: 100}, {height: 20, width: 20}, 'right', 5, {})).toBe(false);
            expect(collision.check({x: 110, y: 100}, {height: 30, width: 30}, 'right', 5, {})).toBe(false);
            expect(collision.check({x: 450, y: 450}, {height: 40, width: 40}, 'right', 5, {})).toBe(false);
            expect(collision.check({x: 310, y: 295}, {height: 40, width: 40}, 'down', 5, {id: 'Collision1'})).toEqual({collisionId: 'Object1', vector: 300});
            expect(collision.check({x: 116, y: 390}, {height: 50, width: 50}, 'right', 5, {id: 'Collision2'})).toEqual({collisionId: 'Object2', vector: 120});
            expect(collision.check({x: 495, y: 490}, {height: 20, width: 20}, 'right', 5, {id: 'Collision3'})).toEqual({collisionId: 'Object3', vector: 500});
        });

        it('should verify an object exists after adding it to the collision vector', function () {
            var object = {id: 'ObjectExistsInCollisionVector', height: 400, width: 400, x: 600, y: 600};

            expect(collision.exists('ObjectExistsInCollisionVector')).toBe(false);
            collision.add(object);

            expect(collision.exists('ObjectExistsInCollisionVector')).toBe(true);
        });

        it('should completely remove an object from the collision vector', function () {
            var object = {id: 'ShouldRemoveThisFromCollisionVector', height: 400, width: 400, x: 800, y: 800},
                self = collision.returnSelf();

            collision.add(object);

            expect(collision.exists('ShouldRemoveThisFromCollisionVector')).toBe(true);
            expect(self.CDSObj.vector.y[800]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.y[800].length).toEqual(1);
            expect(self.CDSObj.vector.y[1200].length).toEqual(1);
            expect(self.CDSObj.vector.x[800].length).toEqual(1);
            expect(self.CDSObj.vector.x[1200].length).toEqual(1);

            collision.remove('ShouldRemoveThisFromCollisionVector');
            expect(self.CDSObj.vector.y[800].length).toEqual(0);
            expect(self.CDSObj.vector.y[800].length).toEqual(0);
            expect(self.CDSObj.vector.y[1200].length).toEqual(0);
            expect(self.CDSObj.vector.x[800].length).toEqual(0);
            expect(self.CDSObj.vector.x[1200].length).toEqual(0);
        });
    });
});