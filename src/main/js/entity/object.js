/**
 * Created by christhaw on 11/20/15.
 */
define('object', ['exports', 'constants', 'utility', 'collision', 'dialogue'], function (object, constants, utility, collision, dialogue) {

    object.Entity = function (config) {

        var object = this;

        var self = {
            container: document.createElement('canvas'),
            parent: null,
            direction: {
                left: false,
                right: false,
                down: false,
                up: false
            },
            loading: {},
            sprite: {
                animationVector: {}
            },
            animationIndex: 0,
            animation: null,
            facing: 'down',
            frameHandle: 0,
            image: null,
            canCollide: false,
            canDialogue: false,
            dialogue: null,
            position: {
                left: 0,
                top: 0
            },
            ctx: null
        };

        self.reloadObjectState = function () {

            if (utility.isObject(self.animation)) {

                // Clear canvas
                self.ctx.clearRect(
                    0, 0,
                    self.container.width,
                    self.container.height
                );

                // Store the object animation vector in a temporary object
                self.oav = self.sprite.animationVector[self.animation.name];

                // Redraw the image unto the canvas
                self.container.height = self.sprite.height;
                self.container.width = self.sprite.width;
                if (self.sprite.height && self.sprite.width) {
                    self.ctx.drawImage(
                        self.image, self.oav[self.animationIndex].x, self.oav[self.animationIndex].y,
                        self.sprite.width, self.sprite.height,
                        0, 0,
                        self.container.width, self.container.height
                    );
                }

                if (self.animation.type === 'iterate') {

                    if (self.animationIndex + 1 < self.oav.length) {
                        self.animationIndex++;
                    }
                    else {
                        self.flag = self.animation.flag;
                        self.animation = undefined;
                        self.block = false;
                    }
                }
                else if (self.animation.type === 'loop') {

                    if (self.animationIndex + 1 < self.oav.length) {
                        self.animationIndex++;
                    }
                    else {
                        self.animationIndex = 0;
                    }
                }
            }
            if (object.isMoving()) {
                var pos = {
                        x: self.facing === constants.right ? (object.x + self.container.width) : object.x,
                        y: self.facing === constants.down ? (object.y + self.container.height) : object.y
                    },
                    dimension = {height: object.height, width: object.width},
                    collided = self.canCollide && collision.check(pos, dimension, self.facing, self.range, object);

                if (collided) {
                    self.event = {type: 'collision', data: collided};
                }
                else if (self.direction.up) {
                    collision.remove(object.id);
                    object.y -= self.range;
                    collision.add(object);
                }
                else if (self.direction.right) {
                    collision.remove(object.id);
                    object.x += self.range;
                    collision.add(object);
                }
                else if (self.direction.down) {
                    collision.remove(object.id);
                    object.y += self.range;
                    collision.add(object);
                }
                else if (self.direction.left) {
                    collision.remove(object.id);
                    object.x -= self.range;
                    collision.add(object);
                }

                self.container.style.left = object.x + 'px';
                self.container.style.top = object.y + 'px';
            }
        };

        self.resize = function () {
            object.height = self.container.offsetHeight;
            object.width = self.container.offsetWidth;
            object.x = self.container.offsetLeft;
            object.y = self.container.offsetTop;
        };

        self.frameRate = config.frameRate || constants.defaultFrameRate;
        self.canCollide = config.canCollide || false;
        self.canDialogue = config.canDialogue || false;
        self.parent = config.parent || null;
        self.range = config.range || 5;

        if (utility.isObject(config.sprite)) {
            self.loading.sprite = false;
            self.sprite = config.sprite;
            self.image = new Image();
            self.image.src = self.sprite.image;
            self.image.height = self.sprite.height;
            self.image.width = self.sprite.width;
            self.image.onload = function () {
                self.ctx.drawImage(
                    self.image, self.sprite.x || 0, self.sprite.y || 0,
                    self.sprite.width, self.sprite.height,
                    0, 0,
                    self.sprite.width, self.sprite.height
                );
                self.loading.sprite = true;
                self.resize();

                if (utility.isHtmlElement(self.parent)) {
                    self.parent.appendChild(self.container);
                }
            };

            object.height = self.image.height;
            object.width = self.image.width;

            object.x = self.sprite.left || self.sprite.x || 0;
            object.y = self.sprite.top || self.sprite.y || 0;

            self.ctx = self.container.getContext('2d');

            self.container.style.left = object.x + 'px';
            self.container.style.top = object.y + 'px';
            self.container.style.position = 'absolute';

            self.container.height = object.height;
            self.container.width = object.width;
        }

        object.id = config.id;

        self.container.setAttribute('id', object.id);
        if (self.canDialogue) {
            self.dialogue = new dialogue.box(object);
        }

        object.animate = function (animation) {
            self.animationIndex = animation.type === 'loop' ? self.animationIndex : 0;
            self.animation = animation;

            object.flag = animation.flag;
        };

        object.activate = function () {
            self.frameHandle = setInterval(self.reloadObjectState, self.frameRate);
            self.resize();

            collision.add(object);
        };

        object.deactivate = function (timeout) {
            clearInterval(self.frameHandle);
            if (timeout && utility.isNumber(timeout)) {
                setTimeout(function () {
                    object.activate();
                }, timeout);
            }
        };

        object.isMoving = function () {
            return self.direction.right || self.direction.left
                || self.direction.down || self.direction.up;
        };

        object.isTalking = function () {
            return self.dialogue && self.dialogue.isDisplayed();
        };

        object.setFrameRate = function (frameRate) {
            if (utility.isNumber(frameRate)) {
                self.frameRate = frameRate;
                object.deactivate(1);
            }
        };

        object.move = function (direction, range) {
            range = range || self.range;
            switch (direction) {

                case constants.right:
                    object.x += range;
                    break;

                case constants.down:
                    object.y += range;
                    break;

                case constants.left:
                    object.x -= range;
                    break;

                case constants.up:
                    object.y -= range;
                    break;
            }

            self.container.style.left = object.x + 'px';
            self.container.style.top = object.y + 'px';
        };

        object.place = function (x, y) {
            if (utility.isNumber(x) && utility.isNumber(y)) {
                self.container.style.left = x + 'px';
                self.container.style.top = y + 'px';
                collision.remove(object.id);

                object.x = x;
                object.y = y;

                collision.add(object);
            }
        };

        object.stop = function () {
            self.direction = {
                left: false, right: false,
                down: false, up: false
            };
        };

        object.stopAnimation = function () {
            self.animation = undefined;
        };

        object.talk = function (txt) {
            if (!object.isTalking()) {
                self.dialogue.show(txt);
            }
        };

        object.quiet = function () {
            if (object.isTalking()) {
                self.dialogue.hide();
            }
        };

        object.trajecting = function () {
            return self.facing;
        };

        object.traject = function (direction, frameRange, canCollide) {
            object.stop();

            self.range = frameRange || self.range;
            self.direction[direction] = true;
            self.canCollide = canCollide;
            self.facing = direction;
        };

        object.finishedLoading = function () {
            var finished = true;
            Object.keys(self.loading).forEach(function (key) {
                finished = finished && self.loading[key];
            });

            return finished;
        };
    };
});