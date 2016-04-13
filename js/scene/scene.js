/**
 * Created by christhaw on 2/28/16.
 */
function Scene(config) {

    var modules = config.modules || {}, sceneDict = {}, self = this;
    var execute = function (exec) {
        console.log('Running ' + exec);
        eval(exec);
    };
    self.add = function (scene) {
        if (_util.isObject(scene) && !sceneDict[scene.id]) {
            sceneDict[scene.id] = scene;
            sceneDict[scene.id].execution = [];

            for (var a=0; a < scene.actions.length; a++) {
                var actionObject = scene.actions[a];
                if (scene.actions[a].hasOwnProperty('module')) {
                    sceneDict[scene.id].execution.push({
                        action: _util.buildFunctionFromArray('modules.' + actionObject['module'] + '.' + actionObject.action['name'], actionObject.action['params']),
                        duration: actionObject.duration || 0
                    });
                }
                else if (scene.actions[a].hasOwnProperty('actor')) {
                    var invokeActorString = 'sceneDict[\'' + scene.id + '\'].actors';
                    sceneDict[scene.id].execution.push({
                        action: _util.buildFunctionFromArray(invokeActorString + '[\'' + actionObject['actor'] + '\'].' + actionObject.action['name'], actionObject.action['params']),
                        duration: actionObject.duration || 0
                    });
                }
            }
        }
        else if (_util.isObject(scene)) {
            console.log('Could not add scene with name ' + scene.name);
        }
        else {
            console.log('Could not add scene. Not an Object');
        }
    };

    self.remove = function (id) {
        if (sceneDict[id]) {
            delete sceneDict[id];
        }
    };

    self.run = function(id) {
        var execution, duration = 0, index = 0;
        if (_util.isObject(sceneDict[id])) {
            execution = sceneDict[id].execution || [];
            for (var e=0; e < execution.length; e++) {
                (function (index) {
                    setTimeout(function() {
                        eval(execution[index].action);
                    }, duration);
                })(e);
                duration += execution[e].duration;
            }
        }
        else {
            console.log('Could not run scene with id ' + id + '. Scene does not exist');
        }
    };


}