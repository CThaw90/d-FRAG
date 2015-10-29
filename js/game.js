/**
 * Created by Chris on 10/8/2015.
 */

function Game(config) {

    var collision = new Collision(),
        entities = {},
        self = this;

    self.currentStage = new Stage({

        // We should probably put the stage inside an Html container
        // to control the position, spacing and size more seamlessly
        container: document.createElement('div'),
        id: 'currentStage-fullscreen',
        screenType: 'full',
        background: {
            color: '#000000',
            image: null
        }

    });

    // Probably going to load all data for configurations from a server resource
    entities['main-character'] = new Character({

        container: document.createElement('canvas'),
        isControllable: true,
        id: 'main-character',
        frameRate: 100,
        cd: collision,
        position: {
            left: 100,
            top: 100
        },
        height: 100,
        width: 72,
        // Not sure whether to make speed a configurable attribute
        // or fixed at a certain value for movement consistency
        speed: 5

    }, {

        src: 'img/spritesheet.png',
        sectionHeight: 100,
        sectionWidth: 72,
        // This is definitely gonna have to be moved into its own JSON file
        // Animation Vector is responsible for all animations pertaining to a certain entity object
        animationVector: {
            'animate-movingUp': [
                {
                    description: 'Left foot forward animation walking up',
                    height: 100,
                    width: 72,
                    x: 0,
                    y: 0
                },
                {
                    description: 'Standing animation looking up',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 0
                },
                {
                    description: 'Right foot forward animation walking up',
                    height: 100,
                    width: 72,
                    x: 144,
                    y: 0
                },
                {
                    description: 'Standing animation looking up',
                    height: 100,
                    width: 72,
                    x: 144,
                    y: 0
                }
            ],
            'animate-movingRight' : [
                {
                    description: 'Right foot forward animation walking right',
                    height: 100,
                    width: 72,
                    x: 0,
                    y: 100
                },
                {
                    description: 'Standing animation looking right',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 100
                },
                {
                    description: 'Left foot forward animation walking right',
                    height: 100,
                    width: 72,
                    x: 144,
                    y: 100
                },
                {
                    description: 'Standing animation looking right',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 100
                }
            ],
            'animate-movingDown' : [
                {
                    description: 'Right foot forward animation walking down',
                    height: 100,
                    width: 72,
                    x: 0,
                    y: 200
                },
                {
                    description: 'Standing animation looking down',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 200
                },
                {
                    description: 'Left foot forward animation walking down',
                    height: 100,
                    width: 72,
                    x: 144,
                    y: 200
                },
                {
                    description: 'Standing animation looking down',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 200
                }
            ],
            'animate-movingLeft' : [
                {
                    description: 'Right foot forward animation walking left',
                    height: 100,
                    width: 72,
                    x: 0,
                    y: 300

                },
                {
                    description: 'Standing animation looking left',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 300
                },
                {
                    description: 'Left foot forward animation walking left',
                    height: 100,
                    width: 72,
                    x: 144,
                    y: 300
                },
                {
                    description: 'Standing animation looking left',
                    height: 100,
                    width: 72,
                    x: 72,
                    y: 300
                }
            ]
        }

    });

    self.play = function () {
        self.currentStage.activate();
    };

    // Initializing the Game
    self.currentStage.placeEntity({object: entities['main-character'], id: 'main-character'});

    // Setting up the boundaries
    collision.add(self.currentStage);

}