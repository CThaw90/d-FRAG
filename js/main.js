/**
 * Created by Chris on 10/8/2015.
 *
 * This is the entry point to the entire game application
 *
 * A lot more logic is supposed to be here in order to properly
 * initialize the game but we can figure that out in the future
 */

(function () {
    // Initialize game
    var start = function(elem) {
        elem.parentNode.removeChild(elem);
        game.play();
    }, buttonElem, game;

    // Start game play after document finishes loading
    _util.waitUntil(_util.domLoaded, [], function() {

        scrollTo(0, 0);
        buttonElem = document.createElement('button');
        buttonElem.setAttribute('id', 'start-game');
        buttonElem.textContent = 'Start Game'; // Firefox support API
        buttonElem.innerText = 'Start Game'; // Chrome support API
        buttonElem.onclick = function () {
            buttonElem.parentNode.removeChild(document.getElementById('start-game'));
            game = new Game();
            game.load(withObjects);
            game.play(withInteractions);
        };
        document.body.appendChild(buttonElem);
    }, []);
})();
