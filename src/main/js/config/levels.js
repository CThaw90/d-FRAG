define('levels', ['exports'], function (level) {

    var levels = {
        levelFiles: []
    };

    levels.LEVEL_ONE_INTRODUCTION = {

        stage: {
            backgroundImage: '/defrag-content/images/stages/grass.png',
            id: 'main-stage-introduction',
            ais: [
                {load: '/defrag-content/artificial-intelligence/roaming-character.json'}
            ],
            objects: [
                {load: '/defrag-content/objects/characters/main-character.json', id: 'main-character'},
                {load: '/defrag-content/objects/characters/harold.json', id: 'harold'},
                {load: '/defrag-content/objects/characters/mr-lorenzo.json', id: 'mr-lorenzo'},
                {load: '/defrag-content/objects/characters/mr-ree.json', id: 'mr-ree'},

                {load: '/defrag-content/objects/doors/steel-door.json', id: 'steel-door'},
                {load: '/defrag-content/objects/doors/black-door.json', id: 'black-door'}
            ]
        },
        scenes: [
            {load: '/defrag-content/scenes/Introduction/opening_scene.json', id: 'introduction'}
        ]
    };

    level.load = function (levelId) {
        return levels[levelId] || {};
    };

    level.add = function (level) {
        if (!level.id) { return; }
        levels[level.id] = level;
    };
});