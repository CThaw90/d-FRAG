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
    baseUrl: './js/.',
    paths: {
        constants: 'util/static/constants',
        http: 'util/objects/http',
        interact: 'util/objects/interact',
        interactions: 'util/static/config/interactions',
        screen: 'util/objects/screen',
        stage: 'entity/stage',
        utility: 'util/static/utility'
    }
});

define(['utility'], function (utility) {

    // Initialize D-FRAG game
    var startButton = document.createElement('button');

    utility.waitUntil(utility.domLoaded, [], function() {

        window.scrollTo(0, 0);

        startButton.setAttribute('id', 'start-game');
        startButton.textContent = 'Start Game';
        startButton.innerText = 'Start Game';
        startButton.onclick = function () {
            startButton.parentNode.removeChild(startButton);
        };
        document.body.appendChild(startButton);
    }, []);

    var startGame = function () {

    };
});