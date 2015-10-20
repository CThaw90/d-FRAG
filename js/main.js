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
        new Game({}).play();
    }, buttonElem;

    // Start game play after document finishes loading
    var waitingForGameToLoad = setInterval(function(){
        if (document.readyState === 'complete') {
            clearInterval(waitingForGameToLoad);

            buttonElem = document.createElement('button');
            buttonElem.setAttribute('id', 'start-game');
            buttonElem.innerText = 'Start Game';
	    buttonElem.textContent = 'Start Game';
            buttonElem.onclick = function () {
                buttonElem.parentNode.removeChild(document.getElementById('start-game'));
                new Game({}).play();
            };
            document.body.appendChild(buttonElem);
        }
    }, 500);


})();
