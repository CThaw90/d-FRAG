/**
 * Created by christhaw on 7/12/16.
 */
define(['utility'], function (utility) {
    /* globals describe, it, xit, jasmine */

    describe('Utility Module', function () {

        it('Should be a valid object', function () {
            expect(utility).toEqual(jasmine.any(Object));
        });

        it('Should determine if a number is a valid type of number', function () {
            var valueIs = {notANumber: 'NOT_A_NUMBER', aNumber: 14}, aNumber = true;

            expect(utility.isNumber(valueIs.notANumber)).not.toBe(aNumber);
            expect(utility.isNumber(valueIs.aNumber)).toBe(aNumber);
        });

        it('Should determine if a boolean is a valid type of boolean', function () {
            var valueIs = {notABoolean: undefined, aTrueBoolean: true, aFalseBoolean: false}, aBoolean = true;

            expect(utility.isBoolean(valueIs.notABoolean)).not.toBe(aBoolean);
            expect(utility.isBoolean(valueIs.aTrueBoolean)).toBe(aBoolean);
            expect(utility.isBoolean(valueIs.aFalseBoolean)).toBe(aBoolean);
        });

        it('Should determine if a string is a valid type of string', function () {
            var valueIs = {aString: String(), notAString: 14, alsoNotAString: true}, aString = true;

            expect(utility.isString(valueIs.aString)).toBe(aString);
            expect(utility.isString(valueIs.notAString)).not.toBe(aString);
            expect(utility.isString(valueIs.alsoNotAString)).not.toBe(aString);
        });

        it('Should determine if an object is a valid type object', function () {
            var valueIs = {anObject: {}, notAnObject: '{}', alsoNotAnObject: []}, anObject = true;

            expect(utility.isObject(undefined)).not.toBe(anObject);
            expect(utility.isObject(valueIs.anObject)).toBe(anObject);
            expect(utility.isObject(valueIs.notAnObject)).not.toBe(anObject);
            expect(utility.isObject(valueIs.alsoNotAnObject)).not.toBe(anObject);
        });

        it('Should determine if an array is a valid type of array', function () {
            var valueIs = {anArray: [], notAnArray: '[]', alsoNotAnArray: {length: 0}}, anArray = true;

            expect(utility.isArray(valueIs.anArray)).toBe(anArray);
            expect(utility.isArray(valueIs.notAnArray)).not.toBe(anArray);
            expect(utility.isArray(valueIs.alsoNotAnArray)).not.toBe(anArray);
        });

        it('Should determine if a function is a valid type of function', function () {
            var valueIs = {
                aFunction: function () {

                },
                notAFunction: 'function () {}',
                alsoNotAFunction: {
                    type: function () {

                    }
                }
            }, aFunction = true;

            expect(utility.isFunction(valueIs.aFunction)).toBe(aFunction);
            expect(utility.isFunction(valueIs.notAFunction)).not.toBe(aFunction);
            expect(utility.isFunction(valueIs.alsoNotAFunction)).not.toBe(aFunction);
        });

        it('Should determine if an HtmlElement is a valid type of HtmlElement', function () {
            var valueIs = {anHtmlElement: document.createElement('div'), notAnHtmlElement: '<div id="element"></div>'}, anHtmlElement = true;

            expect(utility.isHtmlElement(valueIs.anHtmlElement)).toBe(anHtmlElement);
            expect(utility.isHtmlElement(valueIs.notAnHtmlElement)).not.toBe(anHtmlElement);
        });

        it('Should filter out all single quotes and escape them with backslashes', function () {
            var string = "They're We're What's It's";

            expect(utility.escape(string)).toEqual("They\\'re We\\'re What\\'s It\\'s");
            expect(utility.escape(string)).not.toEqual("They're We're What's It's");
        });

        // TODO: Needs more unit test case scenarios
        it('Should properly convert an array into an object based on a supplied value', function () {
            var array = ['game', 'entity', 'config', 'scene', 'util', 'defrag'],
                object = {game: true, entity: true, config: true, scene: true, util: true, defrag: true},
                mirrorObject = {game: 'game', entity: 'entity', config: 'config', scene: 'scene', util: 'util', defrag: 'defrag'},
                arrayOfObjects = [
                    {game: 'd-RAG', config: 'settings', entity: 'object'},
                    {game: 'brick', config: 'setup', entity: 'character'},
                    {game: 'hextris', config: 'config', entity: 'wall'},
                    {game: 'minecraft', config: 'install', entity: 'tree'}
                ],
                objectOfObjects = {
                    settings: {game: 'd-RAG', config: 'settings', entity: 'object'},
                    setup: {game: 'brick', config: 'setup', entity: 'character'},
                    config: {game: 'hextris', config: 'config', entity: 'wall'},
                    install: {game: 'minecraft', config: 'install', entity: 'tree'}
                };

            expect(utility.arrayToObject(array, true)).toEqual(object);
            expect(utility.arrayToObject(array)).toEqual(mirrorObject);
            expect(utility.arrayToObject(arrayOfObjects, null, 'config')).toEqual(objectOfObjects);
        });

        it('Should properly convert css rules into a JSON Object', function () {
            var cssRules = 'position: relative; left: 115px; top: 200px; float: left; background-image: url(http://gamesfolio.com/defrag-images/stages/grass.png);',
                json = {position: 'relative', left: '115px', top: '200px', float: 'left', 'background-image': 'url(http://gamesfolio.com/defrag-images/stages/grass.png)'};

            expect(utility.cssToJSON(cssRules)).toEqual(json);
        });

        it('Should properly convert a JSON Object into a list of css rules', function () {
            var cssRules = 'position: relative; left: 115px; top: 200px; float: left; background-image: url(http://gamesfolio.com/defrag-images/stages/grass.png); ',
                json = {position: 'relative', left: '115px', top: '200px', float: 'left', 'background-image': 'url(http://gamesfolio.com/defrag-images/stages/grass.png)'};

            expect(utility.jsonToCSS(json)).toEqual(cssRules);
        });

        it('Should not execute the function until the executing job returns true', function () {
            var counter = 0, thisReturnsTrue = function (object) { return object.boolean; }, withArgs = {boolean: false}, toExecute = function () { counter++;};

            utility.waitUntil(thisReturnsTrue, [withArgs], toExecute, []);
            setTimeout(function () {
                expect(counter).toBe(0);
                withArgs.boolean = true;
            }, 1000);

            expect(counter).toBe(0);
            setTimeout(function () {
                expect(counter).toBe(1);
            }, 2000);
        });

        it('Should build a string representation of a function from a string and array', function () {

            var functionWithNumberArgs = 'generatedFunction(0,1,3)',
                functionWithStringArgs = 'generatedFunction("Hello","World")',
                functionWithQuotedArgs = 'generatedFunction("They\\\'re","We\\\'re")',
                functionWithObjectArgs = 'generatedFunction({"name":"Chris","age":26})';

            expect(utility.buildFunctionFromArray('generatedFunction', [0, 1, 3])).toEqual(functionWithNumberArgs);
            expect(utility.buildFunctionFromArray('generatedFunction', ['Hello', 'World'])).toEqual(functionWithStringArgs);
            expect(utility.buildFunctionFromArray('generatedFunction', ['They\'re', 'We\'re'])).toEqual(functionWithQuotedArgs);
            expect(utility.buildFunctionFromArray('generatedFunction', [{name: 'Chris', age: 26}])).toEqual(functionWithObjectArgs);
        });
    });
});