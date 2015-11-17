/**
 * Created by Chris on 10/8/2015.
 */

function Game() {

    var collision = new Collision(),
        http = new HttpRequest(),
        entities = {},
        loading = {},
        self = this;

    self.play = function () {
        var finishLoading = setInterval(function() {

            if (self.finishedLoading()) {
                self.currentStage.placeEntity({object: entities[self.config.mainCharacter.id], id: self.config.mainCharacter.id});
                self.currentStage.lockOn(self.config.mainCharacter.id);
                self.currentStage.activate();
                clearInterval(finishLoading);
            }

        }, 100);
    };

    self.load = function (config) {
        var mainCharacter = config.mainCharacter, stage = config.stage;
        loading[mainCharacter.id] = false;
        loading[stage.id] = false;
        self.config = config;

        var backgroundImage = new Image();
        backgroundImage.src = stage.backgroundImage;
        backgroundImage.onload = function() {
            loading[stage.id] = true;
            self.currentStage = new Stage({
                container: document.createElement('div'),
                screenType: 'full',
                id: stage.id,
                cd: collision,
                background: {
                    image: {
                        object: backgroundImage
                    }
                }
            });
        };

        http.get({
            url: mainCharacter.sprite,
            onSuccess: function(response) {
                loading[config] = true;
                entities[mainCharacter.id] = new Character({
                    container: document.createElement('canvas'),
                    sprite: JSON.parse(response),
                    isControllable: true,
                    id: mainCharacter.id,
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
}