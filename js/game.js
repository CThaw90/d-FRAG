/**
 * Created by Chris on 10/8/2015.
 */

function Game(config) {

    var self = this;
    var entities = {};

    self.currentStage = new Stage(document.getElementById('gameCanvas'), {

        height: $util.getWindowHeight(),
        width: $util.getWindowWidth(),
        background: {
            color: $const.black,
            image: null
        }
    });

    entities['main-character'] = new Character({

        container: document.createElement('canvas'),
        isControllable: true,
        frameRate: 100,

        height: 200,
        width: 200

    }, {

        src: 'img/spritesheet.png'

    });

    self.play = function () {

        console.log('Game Started');

        self.currentStage.placeEntity(entities['main-character'], {});

    };
}