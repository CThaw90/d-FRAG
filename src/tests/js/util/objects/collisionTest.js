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
            expect(self.CDSObj.vector.x[100]).toEqual(jasmine.any(Array));
            expect(self.CDSObj.vector.x[100][0].start).toEqual(100);
            expect(self.CDSObj.vector.x[100][0].end).toEqual(200);
            expect(self.CDSObj.vector.x[100][0].id).toEqual('TestingAddCollisionObject');
            expect(self.CDSObj.vector.x[200][0].start).toEqual(100);
            expect(self.CDSObj.vector.x[200][0].end).toEqual(200);
            expect(self.CDSObj.vector.x[200][0].id).toEqual('TestingAddCollisionObject');
        });
    });
});