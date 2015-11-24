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
    var waitingForGameToLoad = setInterval(function(){
        if (document.readyState === 'complete') {
            clearInterval(waitingForGameToLoad);

            buttonElem = document.createElement('button');
            buttonElem.setAttribute('id', 'start-game');
            buttonElem.textContent = 'Start Game';
            buttonElem.innerText = 'Start Game';
            buttonElem.onclick = function () {
                buttonElem.parentNode.removeChild(document.getElementById('start-game'));
                game = new Game();
                game.load({
                    mainCharacter: {
                        sprite: _const.basePath + '/json/sprites/main-character.json',
                        id: 'main-character'
                    },
                    stage: {
                        backgroundImage: _const.basePath + '/img/stages/grass.png',
                        id: 'main-stage',
                        objects: [
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_a.json',
                                id: 'tree_a'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_b.json',
                                id: 'tree_b'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_c.json',
                                id: 'tree_c'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_d.json',
                                id: 'tree_d'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_e.json',
                                id: 'tree_e'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_f.json',
                                id: 'tree_f'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_h.json',
                                id: 'tree_h'
                            },
                            {
                                load: _const.basePath + '/json/sprites/trees/tree_i.json',
                                id: 'tree_i'
                            },
                            {
                                load: _const.basePath + '/json/sprites/walls/stone-walls_a.json',
                                id: 'stone-walls_a'
                            },
                            {
                                load: _const.basePath + '/json/sprites/walls/stone-walls_b.json',
                                id: 'stone-walls_b'
                            }
                        ]
                    }
                });
                game.play();
            };
            document.body.appendChild(buttonElem);
        }
    }, 500);
})();
