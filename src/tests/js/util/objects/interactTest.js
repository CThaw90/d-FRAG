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

            return {
                id: id,
                x: 'X_COORDINATE',
                y: 'Y_COORDINATE',
                trajecting: function (payload) {
                    return payload || 'trajecting';
                }
            };
        });

        /* Prepare interactions object */
        beforeEach(function() {
            for (var id in interactions) {
                if (interactions.hasOwnProperty(id)) {
                    spyOn(interactions[id], 'does');
                }
            }

            spyOn(window, 'addEventListener');
            if (stage.getObject.and.calls) {
                stage.getObject.and.calls.reset();
                stage.getObject.and.callFake(function (id) {

                    interactions[id].objectReference = {
                        id: id,
                        x: 'X_COORDINATE',
                        y: 'Y_COORDINATE',
                        trajecting: function (payload) {
                            return payload || 'trajecting';
                        }
                    };

                    return interactions[id].objectReference;
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
                var self = interact.returnSelf(), objects;

                objects = self.populateObjects(interactions['interaction_module_character'].objects);

                expect(stage.getObject).toHaveBeenCalledTimes(4);
                expect(stage.getObject).toHaveBeenCalledWith('character_a');
                expect(stage.getObject).toHaveBeenCalledWith('character_b');
                expect(stage.getObject).toHaveBeenCalledWith('character_c');
                expect(stage.getObject).toHaveBeenCalledWith('character_d');
                expect(objects).toEqual({
                    character_a: {id: 'character_a', x: jasmine.any(String), y: jasmine.any(String), trajecting: jasmine.any(Function)},
                    character_b: {id: 'character_b', x: jasmine.any(String), y: jasmine.any(String), trajecting: jasmine.any(Function)},
                    character_c: {id: 'character_c', x: jasmine.any(String), y: jasmine.any(String), trajecting: jasmine.any(Function)},
                    character_d: {id: 'character_d', x: jasmine.any(String), y: jasmine.any(String), trajecting: jasmine.any(Function)}
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
                interactObject = function (objectId) {
                    return {id: objectId, x: 'X_COORDINATE', y: 'Y_COORDINATE', trajecting: jasmine.any(Function)};
                },
                expectedSelf = {
                    mTrigger: {
                        interaction_module_movement: {
                            movement_a: interactObject('movement_a'),
                            movement_b: interactObject('movement_b'),
                            movement_c: interactObject('movement_c'),
                            movement_d: interactObject('movement_d')
                        },
                        interaction_module_detection: {
                            detection_a: interactObject('detection_a'),
                            detection_b: interactObject('detection_b'),
                            detection_c: interactObject('detection_c'),
                            detection_d: interactObject('detection_d')
                        },
                        interaction_module_walking: {
                            walking_a: interactObject('walking_a'),
                            walking_b: interactObject('walking_b'),
                            walking_c: interactObject('walking_c'),
                            walking_d: interactObject('walking_d')
                        },
                        interaction_module_running: {
                            running_a: interactObject('running_a'),
                            running_b: interactObject('running_b'),
                            running_c: interactObject('running_c'),
                            running_d: interactObject('running_d')
                        }
                    },
                    kTrigger: {
                        interaction_module_character: {
                            character_a: interactObject('character_a'),
                            character_b: interactObject('character_b'),
                            character_c: interactObject('character_c'),
                            character_d: interactObject('character_d')
                        },
                        interaction_module_tree: {
                            tree_a: interactObject('tree_a'),
                            tree_b: interactObject('tree_b'),
                            tree_c: interactObject('tree_c'),
                            tree_d: interactObject('tree_d')
                        },
                        interaction_module_wall: {
                            wall_a: interactObject('wall_a'),
                            wall_b: interactObject('wall_b'),
                            wall_c: interactObject('wall_c'),
                            wall_d: interactObject('wall_d')
                        },
                        interaction_module_door: {
                            door_a: interactObject('door_a'),
                            door_b: interactObject('door_b'),
                            door_c: interactObject('door_c'),
                            door_d: interactObject('door_d')
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
                };

            injector.mock({
                stage: stage,
                collision: collision,
                interactions: interactions
            }).require(['interact', 'interactions'], function (interact, interactions) {
                interact.init();

                var self = interact.returnSelf(), interval;
                // TODO: Finishing writing these unit tests
                expect(window.setInterval).toHaveBeenCalledTimes(4);
                expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), constants.movementCheckInterval);
                expect(expectedSelf.mTrigger).toEqual(self.mTrigger);

                expect(window.addEventListener).toHaveBeenCalledTimes(8);
                expect(window.addEventListener).toHaveBeenCalledWith(constants.keyDown, jasmine.any(Function), false);
                expect(window.addEventListener).toHaveBeenCalledWith(constants.keyUp, jasmine.any(Function), false);
                expect(expectedSelf.kTrigger).toEqual(self.kTrigger);

                expect(expectedSelf.info).toEqual(self.info);

                self.info.interaction_module_character.listener({keyCode: constants.keyMap.enter});
                expect(interactions.interaction_module_character.does).not.toHaveBeenCalled();

                self.info.interaction_module_character.listener({keyCode: constants.keyMap.space});
                expect(interactions.interaction_module_character.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_character.does).toHaveBeenCalledWith(interact, expectedSelf.kTrigger.interaction_module_character, collision, {keyCode: constants.keyMap.space});

                self.info.interaction_module_tree.listener({keyCode: constants.keyMap.space});
                expect(interactions.interaction_module_tree.does).not.toHaveBeenCalled();

                self.info.interaction_module_tree.listener({keyCode: constants.keyMap.enter});
                expect(interactions.interaction_module_tree.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_tree.does).toHaveBeenCalledWith(interact, expectedSelf.kTrigger.interaction_module_tree, collision, {keyCode: constants.keyMap.enter});

                self.info.interaction_module_wall.listener({keyCode: constants.keyMap.enter});
                expect(interactions.interaction_module_wall.does).not.toHaveBeenCalled();

                self.info.interaction_module_wall.listener({keyCode: constants.keyMap.shift});
                expect(interactions.interaction_module_wall.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_wall.does).toHaveBeenCalledWith(interact, expectedSelf.kTrigger.interaction_module_wall, collision, {keyCode: constants.keyMap.shift});

                self.info.interaction_module_door.listener({keyCode: constants.keyMap.shift});
                expect(interactions.interaction_module_door.does).not.toHaveBeenCalled();

                self.info.interaction_module_door.listener({keyCode: constants.keyMap.upArrow});
                expect(interactions.interaction_module_door.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_door.does).toHaveBeenCalledWith(interact, expectedSelf.kTrigger.interaction_module_door, collision, {keyCode: constants.keyMap.upArrow});

                expect(interactions.interaction_module_movement.does).not.toHaveBeenCalled();
                self.info.interaction_module_movement.interval();
                expect(interactions.interaction_module_movement.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_movement.does).toHaveBeenCalledWith(interact, interactObject('trigger_a'), expectedSelf.mTrigger.interaction_module_movement, collision);

                expect(interactions.interaction_module_detection.does).not.toHaveBeenCalled();
                self.info.interaction_module_detection.interval();
                expect(interactions.interaction_module_detection.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_detection.does).toHaveBeenCalledWith(interact, interactObject('detection_trigger'), expectedSelf.mTrigger.interaction_module_detection, collision);

                expect(interactions.interaction_module_walking.does).not.toHaveBeenCalled();
                self.info.interaction_module_walking.interval();
                expect(interactions.interaction_module_walking.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_walking.does).toHaveBeenCalledWith(interact, interactObject('walking_trigger'), expectedSelf.mTrigger.interaction_module_walking, collision);

                expect(interactions.interaction_module_running.does).not.toHaveBeenCalled();
                self.info.interaction_module_running.interval();
                expect(interactions.interaction_module_running.does).toHaveBeenCalledTimes(1);
                expect(interactions.interaction_module_running.does).toHaveBeenCalledWith(interact, interactObject('running_trigger'), expectedSelf.mTrigger.interaction_module_running, collision);

                done();
            });
        });

        it('should disable an interaction object', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage,
                collision: collision,
                interactions: interactions
            }).require(['interact'], function (interact) {
                interact.init();

                var self = interact.returnSelf();
                self.info.interaction_module_character.listener({keyCode: constants.keyMap.space});
                self.info.interaction_module_character.listener({keyCode: constants.keyMap.space});
                expect(interactions.interaction_module_character.does).toHaveBeenCalledTimes(2);
                expect(interactions.interaction_module_character.active).toBe(true);

                interact.disable('interaction_module_character');
                self.info.interaction_module_character.listener({keyCode: constants.keyMap.space});
                expect(interactions.interaction_module_character.does).not.toHaveBeenCalledTimes(3);
                expect(self.info.interaction_module_character.active).toBe(false);

                done();
            });
        });
    });
});