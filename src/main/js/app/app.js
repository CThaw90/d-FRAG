/**
 * Created by christhaw on 10/6/16.
 */
define('app', [
    'exports',
    'constants',
    'utility',
    'loader',
    'levels',
    'game',
    'interact',
    'screen',
    'stage',
    'ai',
    'scene'
], function (app, constants, utility, loader, levels, game, interact, screen, stage, ai, scene) {

    app.start = function () {
        utility.waitUntil(loader.isFinished, [], function () {
            console.log('Loader finished loading');
            game.load(levels.load(constants.levelIds.INTRO));
            utility.waitUntil(game.finishedLoading, [], function () {
                app.play();
            }, []);
        }, []);
    };

    app.play = function () {
        game.play();
        interact.init();
        screen.lockOn(stage.getObject('main-character'));
        ai.start({entity: stage.getObject('harold'), engine: 'artificial_intelligence_for_roaming_character', id: 'harold_roaming_character'});
        ai.start({entity: stage.getObject('mr-lorenzo'), engine: 'artificial_intelligence_for_roaming_character', id: 'mr-lorenzo_roaming_character'});
        screen.fadeFromBlack(5);
        scene.run('d-FRAG_game_introduction_scene');
    };
});