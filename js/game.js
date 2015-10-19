/**
 * Created by Chris on 10/8/2015.
 */

function Game(config) {

    var self = this;
    var entities = {};

    self.currentStage = new Stage({

        // We should probably put the stage inside an Html container
        // to control the position, spacing and size more seamlessly
        
        container: document.createElement('div'),
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
        position: {
            left: 100,
            top: 100
        },
        height: 100,
        width: 72,
        speed: 5

    }, {

        src: 'img/spritesheet.png',
        sectionHeight: 100,
        sectionWidth: 72

    });

    self.play = function () {

        self.currentStage.placeEntity(entities['main-character'], {id : 'main-character'});
        self.currentStage.activate();
    };
}