define('levels', ['exports', 'constants'], function (level, constants) {

    var levels = {};

    levels.LEVEL_ONE_INTRODUCTION = {

        stage: {
            backgroundImage: '/defrag/img/stages/grass.png',
            id: 'main-stage-level-one',
            ais: [
                {load: constants.basePath + '/json/ai/roaming.json'}
            ],
            objects: [
                {load: '/defrag/json/sprites/characters/character.json', id: 'main-character'},
                {load: '/defrag/json/sprites/characters/harold.json', id: 'harold'},
                {load: '/defrag/json/sprites/characters/mr-lorenzo.json', id: 'mr-lorenzo'},
                {load: '/defrag/json/sprites/characters/mr-ree.json', id: 'mr-ree'},

                {load: '/defrag/json/sprites/doors/steel-door.json', id: 'steel-door'},
                {load: '/defrag/json/sprites/doors/black-door.json', id: 'black-door'}
            ]
        },
        scenes: [
            {load: '/defrag/json/scenes/introduction.json', id: 'introduction'}
        ]
    };

    level.load = function (levelId) {
        return levels[levelId] || {};
    };
});