/**
 * Created by Chris on 10/8/2015.
 */

function Game() {

    var collision = new Collision(),
        http = new HttpRequest(),
        entities = {},
        loading = {},
        self = this;

    self.currentStage = new Stage({

        // We should probably put the stage inside an Html container
        // to control the position, spacing and size more seamlessly
        container: document.createElement('div'),
        id: 'currentStage-fullscreen',
        screenType: 'full',
        cd: collision,
        background: {
        //    color: '#000000',
            color: null,
            image: {
                src: 'img/stages/grass.png'
            }
        }

    });

    self.play = function () {
        var finishLoading = setInterval(function() {

            if (self.finishedLoading()) {
                self.currentStage.lockOn('main-character');
                self.currentStage.activate();
                clearInterval(finishLoading);
            }

        }, 100);

    };

    self.load = function (config) {

        loading = {mainCharacter: false};

        http.get({
            url: '/defrag/json/sprites/main-character.json',
            onSuccess: function(response) {
                loading['mainCharacter'] = true;
                entities['main-character'] = new Character({
                    container: document.createElement('canvas'),
                    sprite: JSON.parse(response),
                    isControllable: true,
                    id: 'main-character',
                    frameRate: 50,
                    cd: collision,
                    position: {
                        left: 100,
                        top: 100
                    },
                    height: 100,
                    width: 72,
                    speed: 5
                });

                self.currentStage.placeEntity({
                    object: entities['main-character'],
                    id: 'main-character'
                });
            },
            onError: function(response) {
                console.log('Something went wrong');
                console.log(response);
            },
            headers: {},
            params: {}
        });
    };

    self.finishedLoading = function() {
        var finished = true;
        for (var entity in loading && finished) {
            finished = (loading[entity] ? true : false);
        }

        return finished;
    };

    // Initializing the Game
    // self.currentStage.placeEntity({object: entities['main-character'], id: 'main-character'});

    // Setting up the boundaries
    // collision.add(self.currentStage);

}