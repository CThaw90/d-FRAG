/**
 * Created by christhaw on 8/7/16.
 */
define(['ai'], function (ai) {
    /* globals describe, xit, it, spyOn */
    describe('AI Module', function () {

        it('should validate the configuration of a new ai instruction object', function () {
            var self = ai.returnSelf(), INVALID = false, VALID = true,
                CONFIG = {
                    NO_UNIQUE_ID: getJSONFixture('json/ai/invalid_ai_no_unique_id.json'),
                    NO_INSTRUCTION_NAME: getJSONFixture('json/ai/invalid_ai_no_instruction_name.json'),
                    INTERVAL_CONFLICT: getJSONFixture('json/ai/invalid_ai_interval_conflict.json'),
                    NO_NAME_INTERVAL: getJSONFixture('json/ai/invalid_ai_no_name_interval.json'),
                    VALID: getJSONFixture('json/ai/valid_ai.json')
                };

            expect(self.validateConfiguration(CONFIG.NO_UNIQUE_ID)).toBe(INVALID);
            expect(self.validateConfiguration(CONFIG.NO_INSTRUCTION_NAME)).toBe(INVALID);
            expect(self.validateConfiguration(CONFIG.INTERVAL_CONFLICT)).toBe(INVALID);
            expect(self.validateConfiguration(CONFIG.NO_NAME_INTERVAL)).toBe(INVALID);
            expect(self.validateConfiguration(CONFIG.VALID)).toBe(VALID);
        });

        it('should add, run and remove an ai engine configuration of type random', function () {
            var self = ai.returnSelf(), config = getJSONFixture('json/ai/valid_ai.json'),
                engineId = 'artificial_intelligence_for_roaming_character', objectId = 'object_is_roaming',
                object = jasmine.createSpyObj('object', [
                    'animate', 'traject', 'stopAnimation', 'stop', 'isMoving'
                ]);
            ai.add(config);
            ai.start({entity: object, engine: engineId, id: objectId});

            expect(ai.isRunning(engineId, objectId)).toBe(true);
            ai.stop(engineId, objectId);

            expect(ai.isRunning(engineId, objectId)).toBe(false);
            expect(ai.info(engineId, objectId)).toBe(self.iQueue[engineId].entities[objectId]);
            expect(ai.info(engineId)).toBe(self.iQueue[engineId]);

            ai.remove(engineId, objectId);
            expect(ai.info(engineId)).toBe(self.iQueue[engineId]);
            expect(ai.info(engineId, objectId)).toEqual({engine: 'NOT_AVAILABLE'});
        });
    });
});