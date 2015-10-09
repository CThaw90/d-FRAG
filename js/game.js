/**
 * Created by Chris on 10/8/2015.
 */

function Game(config) {

    var self = this;
    var entities = {};

    self.currentStage = new Stage({


        screenType: 'full',
        background: {
            color: '#000000',
            image: null
        }
    });

    entities['main-character'] = new Character({

        container: document.createElement('canvas'),
        isControllable: true,
        id: 'main-character',
        frameRate: 100,


        height: 100,
        width: 72

    }, {

        src: 'img/spritesheet.png'

    });

    self.play = function () {

        self.currentStage.placeEntity(entities['main-character'], {});

    };
}