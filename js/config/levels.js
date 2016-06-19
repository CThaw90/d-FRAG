define('levels', ['exports', 'constants'], function (level, constants) {

    var levels = {};

    levels.LEVEL_ONE_INTRODUCTION = {

        stage: {
            backgroundImage: constants.basePath + '/img/stages/grass.png',
            id: 'main-stage-level-one',
            objects: [
                {load: constants.basePath + '/json/sprites/characters/character.json', id: 'main-character'},
                {load: constants.basePath + '/json/sprites/characters/harold.json', id: 'harold'},
                {load: constants.basePath + '/json/sprites/characters/mr-lorenzo.json', id: 'mr-lorenzo'},

                {load: constants.basePath + '/json/sprites/doors/steel-door.json', id: 'steel-door'},
                {load: constants.basePath + '/json/sprites/doors/black-door.json', id: 'black-door'}
            ]
        },
        scenes: [
            {load: constants.basePath + '/json/scenes/introduction.json', id: 'introduction'}
        ]
    };

    level.load = function (levelId) {
        return levels[levelId] || {};
    };
});