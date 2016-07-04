/**
 * Created by christhaw on 2/28/16.
 */
define('scene', ['exports', 'stage', 'constants', 'utility', 'interact', 'http', 'collision', 'ai'], function (scene, stage, constants, utility, interact, http, collision, ai) {

    var self = {
        sceneDict: {},
        modules: {
            collision: collision,
            interact: interact,
            http: http,
            ai: ai
        },
        execute: function (exec) {
            console.log('Running ' + exec);
            eval(exec);
        },
        actions: String(),
        actor: String()
    };

    scene.add = function (scene) {
        if (utility.isObject(scene) && !self.sceneDict[scene.id]) {
            self.sceneDict[scene.id] = scene;
            self.sceneDict[scene.id].execution = [];
            for (var a=0; a < scene.actions.length; a++) {
                var actionObject = scene.actions[a];
                if (actionObject.module) {
                    self.sceneDict[scene.id].execution.push({
                        action: utility.buildFunctionFromArray('self.modules.' + actionObject['module'] + '.' + actionObject.action.name, actionObject.action.params),
                        duration: actionObject.duration || 0
                    });
                }
                else if (actionObject.actor) {
                    self.sceneDict[scene.id].execution.push({
                        action: utility.buildFunctionFromArray('stage.getObject(\'' + actionObject.actor + '\').' + actionObject.action.name, actionObject.action.params),
                        duration: actionObject.duration || 0
                    });
                }
            }
        }
        else if (utility.isObject(scene)) {
            console.log('Could not add scene with name ' + scene.name);
        }
        else {
            console.log('Could not add scene. Not an Object');
        }
    };

    scene.remove = function (id) {
        if (self.sceneDict[id]) {
            delete self.sceneDict[id];
        }
    };

    scene.run = function (id) {
        var execution, duration = 0, index = 0;
        if (utility.isObject(self.sceneDict[id])) {
            execution = self.sceneDict[id].execution || [];
            for (var e=0; e < execution.length; e++) {
                (function (index) {
                    setTimeout(function () {
                        try {
                            eval(execution[index].action);
                        } catch (error) {
                            console.error(error);
                            console.log("Violating execution string /* START */ " + execution[index].action);
                            console.log("Violating index - [" + index + "]");
                        }
                    }, duration);
                })(e);
                duration += execution[e].duration;
            }
        }
        else {
            console.log('Could not run scene with id ' + id + '. Scene does not exist');
        }
    };
});