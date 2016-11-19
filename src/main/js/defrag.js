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
        app: 'app/app',
        collision: 'util/objects/collision',
        constants: 'util/static/constants',
        debug: 'util/static/debug',
        dialogue: 'util/objects/dialogue',
        game: 'game',
        http: 'util/objects/http',
        interact: 'util/objects/interact',
        interactions: 'config/interactions',
        levels: 'config/levels',
        loader: 'util/static/loader',
        object: 'entity/object',
        scene: 'scene/scene',
        screen: 'util/objects/screen',
        stage: 'entity/stage',
        utility: 'util/static/utility'
    }
});

define(['utility', 'app', 'loader'], function (utility, app, loader) {

    // Initialize D-FRAG game
    var startButton = document.createElement('button');

    utility.waitUntil(utility.domLoaded, [], function() {

        window.scrollTo(0, 0);

        startButton.setAttribute('id', 'start-game');
        startButton.textContent = 'Start Game';
        startButton.innerText = 'Start Game';
        startButton.onclick = function () {
            startButton.parentNode.removeChild(startButton);
            loader.initialize();
            app.start();
        };
        document.body.appendChild(startButton);
    }, []);
});