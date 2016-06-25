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
                    builder = 'self.iQueue[\'' + config.id + '\'].entity[\'' + method.name + '\']';
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
        });

        if (config.intervals) {

            var intervalEvaluations = self.iQueue[config.id].evaluation.intervals;
            evalIndex = 0;

            config.intervals.forEach(function (interval) {
                var builder = String(), args;

                if (interval.methods) {
                    interval.methods.forEach(function (method) {
                        builder = 'self.iQueue[\'' + config.id + '\'].entity[\'' + method.name + '\']';
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

        self.iQueue[config.id].iFunction = function () {

            var random = Math.floor(Math.random() * (instructionEvaluations.length * 10)) % instructionEvaluations.length;
            var evaluate = instructionEvaluations[random];

            evaluate.execute.forEach(function (andExecute) {
                eval(andExecute);
            });

            if (config.intervals) {

                setTimeout(function () {
                    intervalEvaluations.forEach(function(andExecute) {
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
        self.iQueue[config.id].running = false;
        self.iQueue[config.id].iFunction = null;
        self.iQueue[config.id].iHandle = 0;

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

        if (!self.iQueue[params.id]) {
            console.log('Cannot start ai engine. No ai configuration with id \'' + params.id + '\'');
            return;
        }

        switch (self.iQueue[params.id].type) {

            case constants.aiRandom:
                if (!self.iQueue[params.id].entity) {
                    console.log('Cannot start randomized ai engine. No entity parameter');
                    return;
                }

                self.iQueue[params.id].entity = params.entity;
                self.iQueue[params.id].iHandle = setInterval(self.iQueue[params.id].iFunction, self.iQueue[params.id].interval);
                self.iQueue[params.id].running = true;
                break;
        }
    };

    ai.stop = function (id) {
        if (!self.iQueue[id]) {
            console.log('No ai with id \'' + id + '\' running');
            return;
        }

        self.iQueue[id].running = false;
        switch (self.iQueue[id].type) {

            case constants.aiRandom:
                clearInterval(self.iQueue[id].iHandle);
                self.iQueue[id].entity = null;
                break;
        }
    };

    ai.remove = function (id) {
        delete self.iQueue[id];
    };

    ai.isRunning = function (id) {
        return self.iQueue[id] && self.iQueue[id].running;
    };

    ai.info = function (id) {
        return {};
    };
});