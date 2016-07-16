/**
 * Created by christhaw on 7/13/16.
 */
define(['Squire', 'constants'], function (Squire, constants) {
   /* globals describe, it, xit, jasmine, spyOn, beforeEach */
    describe('Game interaction module', function () {
        var stage = jasmine.createSpyObj('stage', ['getObject']),
            collision = jasmine.createSpyObj('collision', ['check']),
            interactions = getJSONFixture('json/interactions.json');

        stage.getObject.and.callFake(function (id) {
            return {id: id};
        });

        /* Prepare interactions object */
        beforeEach(function() {
            for (var id in interactions) {
                if (interactions.hasOwnProperty(id)) {
                    spyOn(interactions[id], 'does');
                }
            }

            if (stage.getObject.and.calls) {
                stage.getObject.and.calls.reset();
                stage.getObject.and.callFake(function (id) {
                    return {id: id, trajecting: function () {}};
                });
            }

            spyOn(jasmine.getGlobal(), 'setInterval').and.callFake(function (intervalFunction) {
                return intervalFunction;
            });
        });

        it('should be a valid object', function (done) {
            var injector = new Squire();

            injector.mock({
                stage: stage,
                collision: collision,
                interactions: interactions
            }).require(['interact'], function (interact) {
                expect(interact).toEqual(jasmine.any(Object));
                done();
            });
        });

        it('should populate available stage objects by their ids', function (done) {
            var injector = new Squire();

            injector.mock({
                stage: stage,
                collision: collision,
                interactions: interactions
            }).require(['interact'], function (interact) {
                var self = interact.returnSelf(), objects = {};

                objects = self.populateObjects(interactions['interaction_module_character'].objects);

                expect(stage.getObject).toHaveBeenCalledTimes(4);
                expect(stage.getObject).toHaveBeenCalledWith('character_a');
                expect(stage.getObject).toHaveBeenCalledWith('character_b');
                expect(stage.getObject).toHaveBeenCalledWith('character_c');
                expect(stage.getObject).toHaveBeenCalledWith('character_d');
                expect(objects).toEqual({
                    character_a: {id: 'character_a'},
                    character_b: {id: 'character_b'},
                    character_c: {id: 'character_c'},
                    character_d: {id: 'character_d'}
                });

                done();
            });
        });

        it('should determine if the appropriate key was pressed', function (done) {
            var injector = new Squire();

            injector.mock({
                stage: stage,
                collision: collision,
                interactions: interactions
            }).require(['interact'], function (interact) {
                var self = interact.returnSelf(), id, key;
                for (id in interactions) {
                    if (interactions.hasOwnProperty(id) && interactions[id].type === constants.keyPress) {
                        self.info[id] = {active: true};
                        key = interactions[id].config.keys[0];
                        expect(self.keyPressed(constants.keyMap.backspace, interactions[id].config.keys)).toBe(false);
                        expect(self.keyPressed(constants.keyMap[key], interactions[id].config.keys)).toBe(true);
                        break;
                    }
                }
                done();
            });
        });

        it('should properly initialize with all interactions stored in the init interactions object', function (done) {
            var injector = new Squire(),
                expectedSelf = {
                    mTrigger: {
                        interaction_module_movement: {
                            movement_a: {id: 'movement_a'},
                            movement_b: {id: 'movement_b'},
                            movement_c: {id: 'movement_c'},
                            movement_d: {id: 'movement_d'}
                        },
                        interaction_module_detection: {
                            detection_a: {id: 'detection_a'},
                            detection_b: {id: 'detection_b'},
                            detection_c: {id: 'detection_c'},
                            detection_d: {id: 'detection_d'}
                        },
                        interaction_module_walking: {
                            walking_a: {id: 'walking_a'},
                            walking_b: {id: 'walking_b'},
                            walking_c: {id: 'walking_c'},
                            walking_d: {id: 'walking_d'}
                        },
                        interaction_module_running: {
                            running_a: {id: 'running_a'},
                            running_b: {id: 'running_b'},
                            running_c: {id: 'running_c'},
                            running_d: {id: 'running_d'}
                        }
                    },
                    kTrigger: {
                        interaction_module_character: {
                            character_a: {id: 'character_a'},
                            character_b: {id: 'character_b'},
                            character_c: {id: 'character_c'},
                            character_d: {id: 'character_d'}
                        },
                        interaction_module_tree: {
                            tree_a: {id: 'tree_a'},
                            tree_b: {id: 'tree_b'},
                            tree_c: {id: 'tree_c'},
                            tree_d: {id: 'tree_d'}
                        },
                        interaction_module_wall: {
                            wall_a: {id: 'wall_a'},
                            wall_b: {id: 'wall_b'},
                            wall_c: {id: 'wall_c'},
                            wall_d: {id: 'wall_d'}
                        },
                        interaction_module_door: {
                            door_a: {id: 'door_a'},
                            door_b: {id: 'door_b'},
                            door_c: {id: 'door_c'},
                            door_d: {id: 'door_d'}
                        }
                    },
                    info: {
                        interaction_module_character: { active: true, type: 'keypress', listener: jasmine.any(Function) },
                        interaction_module_tree: { active: true, type: 'keypress', listener: jasmine.any(Function) },
                        interaction_module_wall: { active: true, type: 'keypress', listener: jasmine.any(Function) },
                        interaction_module_door: { active: true, type: 'keypress', listener: jasmine.any(Function) },
                        interaction_module_movement: { active: true, type: 'movement', interval: jasmine.any(Function) },
                        interaction_module_detection: { active: true, type: 'movement', interval: jasmine.any(Function) },
                        interaction_module_walking: { active: true, type: 'movement', interval: jasmine.any(Function) },
                        interaction_module_running: { active: true, type: 'movement', interval: jasmine.any(Function) }
                    }
                },
                objects = {
                    interaction_module_character: { id: 'interaction_module_character' },
                    interaction_module_tree: { id: 'interaction_module_tree' },
                    interaction_module_wall: { id: 'interaction_module_wall' },
                    interaction_module_door: { id: 'interaction_module_door' },
                    interaction_module_movement: { id: 'interaction_module_movement'},
                    interaction_module_detection: { id: 'interaction_module_detection'},
                    interaction_module_walking: { id: 'interaction_module_walking'},
                    interaction_module_running: {id: 'interaction_module_running'}
                };

            injector.mock({
                stage: stage,
                collision: collision,
                interactions: interactions
            }).require(['interact'], function (interact) {
                spyOn(window, 'addEventListener');
                stage.getObject = function (id) { return {id: id}; };
                interact.init();
                var self = interact.returnSelf(), interval;

                expect(window); // TODO: Finishing writing these unit tests
                expect(window.setInterval).toHaveBeenCalledTimes(4);
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), constants.movementCheckInterval);
                expect(expectedSelf.mTrigger).toEqual(self.mTrigger);

                expect(window.addEventListener).toHaveBeenCalledTimes(8);
                expect(window.addEventListener).toHaveBeenCalledWith(constants.keyDown, jasmine.any(Function), false);
                expect(window.addEventListener).toHaveBeenCalledWith(constants.keyUp, jasmine.any(Function), false);
                expect(expectedSelf.kTrigger).toEqual(self.kTrigger);

                expect(expectedSelf.info).toEqual(self.info);
                done();
            });
        });
    });
});