/**
 *
 * Created by Chris 06/16/2016
 *
 * This is the entry point to the entire game application
 *
 * A lot more logic is supposed to be here in order to properly
 * initialize the game but we can figure that out in the future
 *
 */

requirejs.config({
    baseUrl: './main/js/',
    paths: {
        ai: 'util/objects/ai',
        collision: 'util/objects/collision',
        constants: 'util/static/constants',
        debug: 'util/static/debug',
        dialogue: 'util/objects/dialogue',
        game: 'game',
        http: 'util/objects/http',
        interact: 'util/objects/interact',
        interactions: 'config/interactions',
        levels: 'config/levels',
        object: 'entity/object',
        scene: 'scene/scene',
        screen: 'util/objects/screen',
        stage: 'entity/stage',
        utility: 'util/static/utility'
    }
});

define(['utility', 'levels', 'game', 'interact', 'screen', 'stage', 'ai', 'scene'], function (utility, levels, game, interact, screen, stage, ai, scene) {

    // Initialize D-FRAG game
    var startButton = document.createElement('button');

    utility.waitUntil(utility.domLoaded, [], function() {

        window.scrollTo(0, 0);

        startButton.setAttribute('id', 'start-game');
        startButton.textContent = 'Start Game';
        startButton.innerText = 'Start Game';
        startButton.onclick = function () {
            startButton.parentNode.removeChild(startButton);
            startGame();
        };
        document.body.appendChild(startButton);
    }, []);

    var startGame = function () {

        game.load(levels.load('LEVEL_ONE_INTRODUCTION'));
        utility.waitUntil(game.finishedLoading, [], function () {
            game.play();
            interact.init();
            screen.lockOn(stage.getObject('main-character'));
            ai.start({entity: stage.getObject('harold'), engine: 'artificial_intelligence_for_roaming_character', id: 'harold_roaming_character'});
            ai.start({entity: stage.getObject('mr-lorenzo'), engine: 'artificial_intelligence_for_roaming_character', id: 'mr-lorenzo_roaming_character'});
            scene.run('d-FRAG_game_introduction_scene');

        }, []);
    };
});