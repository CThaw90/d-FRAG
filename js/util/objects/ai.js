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
function AI (config) {

    var self = this, iFunction, iHandle, valid = false, running = false, object = {};

    self.start = function() {
        if (!valid)
            return;

        iHandle = setInterval(iFunction, config.interval || _const.defaultAiInterval);
        running = true;
    };

    self.stop = function() {
        if (!running)
            return;

        clearInterval(iHandle);
        running = false;
    };

    switch (config.type) {

        case _const.aiRandom:

            randomizedAI();
            break;

        case _const.aiManual:

            break;

        case _const.aiFollow:

            break;

        case _const.aiTarget:

            break;
    }

    function randomizedAI() {

        object = config['object'];

        valid = validateInstructions(config['instructions']);
        valid = valid && config['intervals'] !== undefined ?
            validateIntervals(config['intervals']) : valid;

        if (!valid) {
            console.log('Instruction validation failed');
            return;
        }

        iFunction = function() {

            var instructions = config['instructions'], evaluation = [];
            for (var i = 0; i < instructions.length; i++) {

                var instruction = instructions[i], builder = String(), params, args;
                evaluation.push({name: instruction.name, execute: []});
                if (instruction.hasOwnProperty('methods')) {
                    var methods = instruction['methods'];
                    for (var m = 0; m < methods.length; m++) {

                        builder = "object['" + _util.escape(methods[m].name) + "']";
                        if (methods[m].hasOwnProperty('params')) {

                            params = methods[m]['params'];
                            args = [];
                            for (var p = 0; p < params.length; p++) {

                                if (params['randomized']) {

                                }
                                else if (!params['randomized']) {
                                    args.push(params[p]['body']);
                                }
                            }

                            evaluation[i].execute.push(_util.buildFunctionFromArray(builder, args));
                        }
                    }
                }

                if (instruction.hasOwnProperty('functions')) {

                }
            }

            var random = Math.floor(Math.random() * (evaluation.length * 10)) % evaluation.length;
            var evaluate = evaluation[random];

            for (var e = 0; e < evaluate.execute.length; e++) {
                eval(evaluate.execute[e]);
            }

            if (config['intervals'] && _util.isArray(config['intervals'])) {
                
                setTimeout(function() {

                    var intervalLength = config['intervals'].length, e = [];
                    for (var _interval = 0; _interval < intervalLength; _interval++) {

                        var interval = config['intervals'][_interval], builder = String();
                        if (interval.hasOwnProperty('methods')) {

                            var _methods = interval['methods'];
                            for (var m = 0; m < _methods.length; m++) {

                                builder = "object['" + _util.escape(_methods[m]['name']) + "']";
                                if (_methods[m].hasOwnProperty('params')) {
                                    var _params = _methods[m]['params'], args = [];
                                    for (var p = 0; p < _params.length; p++) {

                                    }

                                    e.push(_util.buildFunctionFromArray(builder, args));
                                }

                            }
                        }

                        if (interval.hasOwnProperty('functions')) {

                            var _functions = interval['functions'];
                        }


                        for (var val = 0; val < e.length; val++) {
                            eval(e[val]);
                        }

                    }

                }, (config.interval / 2));
            }
        };
    }

    function validateIntervals(intervals) {

        var valid = _util.isArray(intervals), interval = {};

        for (var int = 0; valid && int < intervals.length; int++) {

            valid = _util.isObject(intervals[int]);
            if ( valid ) {
                interval = intervals[int];
                valid = _util.isString(interval.name);
                valid = valid ? object[interval.name] !== undefined : valid;

                if (interval['methods']) {
                    valid = validateMethods(interval['methods']);
                }

                if (interval['functions']) {

                    valid = _util.isArray(interval['functions']);
                    valid = valid ? _util.isString(interval['functions']['name']) : valid;
                    valid = valid ? object[interval['methods']['name']] !== undefined : valid;
                    valid = valid && interval['functions']['params'] ? _util.isArray(interval['functions']['params']) : valid;
                }
            }
        }

        return valid;
    }

    function validateInstructions (instructions) {

        var valid = _util.isArray(instructions);
        for (var i = 0; valid && i < instructions.length; i++) {

            var instruction = instructions[i], methods = null, functions = null, params = null;
            valid = _util.isString(instruction.name);

            if ( valid && instruction.hasOwnProperty('methods') ) {
                valid = validateMethods(instruction['methods'])
            }

            if ( valid && instruction.hasOwnProperty('functions') ) {
                valid = _util.isArray(instruction['functions']);
                if ( valid ) {
                    functions = instruction['functions'];
                    for (var f = 0; valid && f < functions.length; f++) {

                    }
                }
            }
        }

        return valid;
    }

    function validateMethods (methods) {

        var valid = _util.isArray(methods), params;
        if ( valid ) {

            for (var m = 0; valid && m < methods.length; m++) {

                valid = _util.isString(methods[m].name);
                valid = valid ? object.hasOwnProperty(methods[m].name) && _util.isFunction(object[methods[m].name]) : valid;

                valid = valid ? methods[m].hasOwnProperty('params') : valid;
                valid = valid ? _util.isArray(methods[m]['params']) : valid;

                if ( valid ) {

                    params = methods[m]['params'];
                    for (var p = 0; valid && p < params.length; p++) {

                        valid = valid ? _util.isBoolean(params[p]['randomized']) : valid;
                        valid = valid ? _util.isString(params[p]['type']) : valid;
                    }
                }
            }
        }

        return valid;
    }
}