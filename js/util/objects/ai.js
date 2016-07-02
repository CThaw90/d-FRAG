/**
 * Created by christhaw on 2/6/16.
 *
 * @params config - Maps the configuration of an AI object
 *
 *  @params type - The type of AI being imposed on the object
 *      random: AI exhibits random animation, movement behavior or both
 *      manual: AI follows a manual set of instruction provided by the config params
 *      follow: AI follows the coordinates of an entity determined by the config param
 *      target: AI targets the coordinates of an entity determined by the config param
 *
 *  @params spec - Specifications object for the given AI configuration
 *      movement: AI exhibits movement behavior. Can be randomized or manually instructed
 *      animate: AI exhibits animation behavior. Can be randomized or manually instructed
 */
define('ai', ['exports', 'constants', 'utility'], function (ai, constants, utility) {

    var self = {
        iQueue: {},

        intervals: {},
        instructions: {
            functions: {},
            methods: {
                params: {
                    randomized: false,
                    type: String()
                }
            }
        }
    };

    self.validateConfiguration = function (config) {
        if (!config.id) {
            console.log('Cannot add ai configuration. No unique identifier.');
            return false;
        }

        if (!self.validateInstructions(config.instructions) || (config.intervals && (!utility.isNumber(config.interval) || !self.validateIntervals(config.intervals)))) {
            console.log('Cannot add ai configuration with id \'' + config.id + '\'. Invalid configuration format');
            return false;
        }

        if (self.iQueue[config.id]) {
            console.log('Cannot add ai configuration with id \'' + config.id + '\' ');
            return false;
        }

        return true;
    };

    self.validateInstructions = function (instructions) {
        var valid = false;
        if (utility.isArray(instructions)) {
            valid = true;
            instructions.forEach(function (instruction) {
                valid = utility.isString(instruction.name);
                if (valid && instruction.methods) {
                    valid = self.validateMethods(instruction.methods);
                }

                if (valid && instruction.functions) {
                    valid = true;
                }
            });
        }

        return valid;
    };

    self.validateIntervals = function (intervals) {
        var valid = false;
        if (utility.isArray(intervals)) {
            valid = true;
            intervals.forEach(function (interval) {

                if (utility.isObject(interval)) {
                    valid = utility.isString(interval.name);

                    if (valid && interval.methods) {
                        valid = self.validateMethods(interval.methods);
                    }

                    if (valid && interval.functions) {
                        valid = utility.isArray(interval.functions) && utility.isString(interval.functions.name);
                        valid = valid && interval.functions.params && utility.isArray(interval.functions.params);
                    }
                }
            });
        }

        return valid;
    };

    self.validateMethods = function (methods) {
        var valid = false;
        if (utility.isArray(methods)) {
            valid = true;
            methods.forEach(function (method) {
                valid = utility.isString(method.name);
                valid = valid && method.hasOwnProperty('params');

                if (valid && utility.isArray(method.params)) {
                    method.params.forEach(function (param) {
                        valid = valid && utility.isBoolean(param.randomized) && utility.isString(param.type);
                    });
                }
            });
        }

        return valid;
    };

    self.randomized = function (config) {

        self.iQueue[config.id].evaluation = {instructions: [], intervals: []};

        var instructionEvaluations = self.iQueue[config.id].evaluation.instructions, evalIndex = 0;
        config.instructions.forEach(function (instruction) {

            var builder = String(), args;
            instructionEvaluations.push({name: instruction.name || '__instruction_' + evalIndex, execute: []});
            if (instruction.methods) {
                instruction.methods.forEach(function (method) {
                    builder = 'self.iQueue[\'' + config.id + '\'].entities[\'{entityId}\'].object[\'' + method.name + '\']';
                    args = [];
                    if (method.params) {
                        method.params.forEach(function (param) {
                            if (param.randomized) {

                            }
                            else {
                                args.push(param.body);
                            }
                        });
                    }

                    instructionEvaluations[evalIndex].execute.push(utility.buildFunctionFromArray(builder, args));
                });
            }
            else if (instruction.functions) {
                console.log('Artificial Intelligence anonymous functions are not yet supported');
            }

            evalIndex++;
        });

        if (config.intervals) {

            var intervalEvaluations = self.iQueue[config.id].evaluation.intervals;
            evalIndex = 0;

            config.intervals.forEach(function (interval) {
                var builder = String(), args;

                if (interval.methods) {
                    interval.methods.forEach(function (method) {
                        builder = 'self.iQueue[\'' + config.id + '\'].entities[\'{entityId}\'].object[\'' + method.name + '\']';
                        args = [];
                        if (method.params) {
                            method.params.forEach(function (param) {

                            });
                            intervalEvaluations.push(utility.buildFunctionFromArray(builder, args));
                        }
                    });
                }
            });
        }

        self.iQueue[config.id].interval = config.interval || constants.defaultAiInterval;
        self.iQueue[config.id].iFunction = function (objectId) {

            var random = Math.floor(Math.random() * (instructionEvaluations.length * 10)) % instructionEvaluations.length;
            var evaluate = instructionEvaluations[random];

            evaluate.execute.forEach(function (andExecute) {
                andExecute = andExecute.replace(new RegExp('\\{entityId\\}', 'g'), objectId);
                eval(andExecute);
            });

            if (config.intervals) {

                setTimeout(function () {
                    intervalEvaluations.forEach(function(andExecute) {
                        andExecute = andExecute.replace(new RegExp('\\{entityId\\}', 'g'), objectId);
                        eval(andExecute);
                    });
                }, config.interval / 2);
            }
        };
    };

    ai.add = function (config) {

        if (!self.validateConfiguration(config)) { return; }

        self.iQueue[config.id] = {};
        self.iQueue[config.id].type = config.type;
        self.iQueue[config.id].entities = {};

        switch (config.type) {

            case constants.aiRandom:
                self.randomized(config);
                break;
        }
    };

    ai.start = function (params) {

        if (!params.id) {
            console.log('Cannot start ai engine. No unique identifier found');
            return;
        }

        if (!self.iQueue[params.engine]) {
            console.log('Cannot start ai engine. No ai configuration with id \'' + params.id + '\'');
            return;
        }

        switch (self.iQueue[params.engine].type) {

            case constants.aiRandom:
                var aiEngine = self.iQueue[params.engine];
                if (aiEngine.entities[params.id] && aiEngine.entities[params.id].running) {
                    console.log('Cannot start engine for \'' + params.id +'\'. Engine for this identifier already running');
                    return;
                }
                else if (aiEngine.entities[params.id] && aiEngine.entities[params.id].object.id === params.entity.id) {
                    aiEngine.entities[params.id].iHandle = setInterval(aiEngine.iFunction.bind(null, params.id), aiEngine.interval);
                    aiEngine.entities[params.id].running = true;
                }
                else {
                    aiEngine.entities[params.id] = {running: true};
                    aiEngine.entities[params.id].object = params.entity;
                    aiEngine.entities[params.id].iHandle = setInterval(aiEngine.iFunction.bind(null, params.id), aiEngine.interval);
                }

                break;
        }
    };

    ai.stop = function (engineId, objectId) {
        if (!self.iQueue[engineId] || !self.iQueue[engineId].entities[objectId]) {
            console.log('No ai with id \'' + id + '\' running');
            return false;
        }

        self.iQueue[engineId].entities[objectId].running = false;
        switch (self.iQueue[id].type) {

            case constants.aiRandom:
                clearInterval(self.iQueue[engineId].entities[objectId].iHandle);
                self.iQueue[engineId].entities[objectId].object = null;
                break;
        }

        return true;
    };

    ai.remove = function (engineId, objectId) {
        if (self.iQueue[engineId] && self.iQueue[engineId].entities[objectId]) {
            var engine = self.iQueue[engineId];
            if (ai.isRunning(engineId, objectId)) {
                ai.stop(engineId, objectId);
            }

            delete engine.entities[objectId];
        }
    };

    ai.isRunning = function (engineId, objectId) {
        return self.iQueue[engineId] && self.iQueue[engineId].entities[objectId]
            && self.iQueue[engineId].entities[objectId].running;
    };

    ai.info = function (id) {
        return {};
    };
});