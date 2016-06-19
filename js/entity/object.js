/**
 * Created by christhaw on 11/20/15.
 */
define('object', ['exports', 'constants', 'utility', 'collision'], function (object, constants, utility, collision) {

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
                animationVector: {},
                imageSrc: String()
            },
            animationIndex: 0,
            animation: null,
            facing: 'down',
            frameHandle: 0,
            image: null,
            canCollide: false,
            canDialogue: false,
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
                        y: self.facing === constants.down ? (object.x + self.container.height) : object.y
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
            var bounds = self.container.getBoundingClientRect();
            object.height = bounds.height;
            object.width = bounds.width;
            object.x = bounds.left;
            object.y = bounds.top;
        };

        self.frameRate = config.frameRate || constants.defaultFrameRate;
        self.canCollide = config.canCollide || false;
        self.canDialogue = config.canDialogue || false;
        self.parent = config.parent || null;

        if (utility.isObject(config.sprite)) {
            self.loading.sprite = false;
            self.sprite = config.sprite;
            self.image = new Image();
            self.image.src = self.sprite.imageSrc;
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

        object.animate = function (animation) {
            self.animationIndex = animation.type === 'loop' ? self.animationIndex : 0;
            self.block = animation.block;
            self.animation = animation;

            object.block = self.block;
        };

        object.activate = function () {
            self.frameHandle = setInterval(self.reloadObjectState, self.frameRate);
            self.resize();
        };

        object.deactivate = function (timeout) {
            clearInterval(self.frameHandle);
            if (timeout && utility.isNumber(timeout)) {
                setTimeout(function () {
                    self.activate();
                }, timeout);
            }
        };

        object.isMoving = function () {
            return self.direction.right || self.direction.left
                || self.direction.down || self.direction.up;
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
            self.animationIndex = 0;
            object.block = false;
        };

        object.trajecting = function () {
            return self.facing;
        };

        object.traject = function (direction, frameRange, canCollide) {
            object.stop();

            self.range = frameRange || self.range;
            self.direction[direction] = true;
            self.canCollide = canCollide;
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
//function Object(config) {
//
//    var self = this,
//        collision = config.cd,
//        direction = {left: false, right: false, up: false, down: false},
//        sprite = _util.isObject(config.sprite) ? config.sprite : {},
//        facing = config.facing, frameHandle, image, collide,
//        dialogue = false, ai = false;
//
//    // The container holding the object sprite or reference point
//    self.$container = document.createElement('canvas');
//
//    // Sets the specified position of the character object
//    self.position = config.position || {left: 0, top: 0};
//
//    // Applies position coordinates to parent container
//    self.$container.style.left = ( sprite.left || self.position.left ) + 'px';
//    self.$container.style.top = ( sprite.top || self.position.top ) + 'px';
//    self.$container.style.position = 'absolute';
//
//    self.$container.height = config.height || sprite.height;
//    self.$container.width = config.width || sprite.width;
//
//    self.height = config.height || sprite.height;
//    self.width = config.width || sprite.width;
//
//    // Captures the context of the object canvas
//    self.ctx = self.$container.getContext('2d');
//    self.animation = config.animation;
//    self.animationIndex = 0;
//
//
//    self.$container.setAttribute('id', config.id);
//    self.id = config.id;
//
//    sprite = _util.isObject(config.sprite) ? config.sprite : {};
//
//    if (sprite.src || sprite['imageSrc']) {
//        image = new Image();
//        image.src = sprite.src || sprite['imageSrc'];
//        image.height = config.height || sprite.height;
//        image.width = config.width || sprite.width;
//        image.onload = function() {
//            self.ctx.drawImage(
//                this, sprite.x || 0, sprite.y || 0,
//                sprite.width, sprite.height,
//                0, 0,
//                sprite.width, sprite.height
//            );
//        }
//    } else if (sprite.object) {
//        image = sprite.object;
//        self.ctx.drawImage(
//            image, sprite.x || 0, sprite.y || 0,
//            sprite['width'], sprite['height'],
//            0, 0,
//            config.width, config.height
//        );
//    }
//
//    // Binds the image to the container canvas
//    self.$container.appendChild(image);
//
//    self.frameRate =  config.frameRate || _const.defaultFrameRate;
//
//    self.animate = function(animation) {
//        self.animationIndex = animation.type === 'loop' ? self.animationIndex : 0;
//        self.block = animation.block;
//        self.animation = animation;
//    };
//
//    self.activate = function() {
//        frameHandle = setInterval(_reloadObjectState, self.frameRate);
//        resize();
//
//        if (config.canCollide) {
//            collision.add(this);
//        }
//    };
//
//    self.deactivate = function (timeout) {
//        clearInterval(frameHandle);
//        if (timeout) {
//            setTimeout(function() {
//                self.activate();
//            }, timeout);
//        }
//    };
//
//    self.place = function (x, y) {
//        if (_util.isNumber(x) && _util.isNumber(y)) {
//            self.$container.style.left = x + 'px';
//            self.$container.style.top = y + 'px';
//            collision.remove(self.id);
//            self.x = x;
//            self.y = y;
//
//            collision.add(this);
//        }
//    };
//
//    self.move = function (direction, range) {
//
//        switch (direction) {
//
//            case _const.right:
//                self.x += range;
//                break;
//
//            case _const.down:
//                self.y += range;
//                break;
//
//            case _const.left:
//                self.y -= range;
//                break;
//
//            case _const.up:
//                self.x -= range;
//                break;
//
//            default:
//                break;
//        }
//
//        self.$container.style.left = self.x + 'px';
//        self.$container.style.top = self.y + 'px';
//    };
//
//    self.trajecting = function() {
//        return facing;
//    };
//
//    self.traject = function(dir, fr, c) {
//        self.stop();
//
//        direction[dir] = true;
//        self.range = fr;
//        facing = dir;
//        collide = c;
//    };
//
//    self.stop = function () {
//        direction = {
//            left: false, right: false,
//            down: false, up: false
//        };
//    };
//
//    self.isMoving = function() {
//        return direction.right || direction.left
//            || direction.down || direction.up;
//    };
//
//    self.stopAnimation = function() {
//        self.animation = undefined;
//        self.animationIndex = 0;
//        self.block = false;
//    };
//
//    self.talk = function(message) {
//        if (dialogue) {
//            dialogue.show(message);
//        }
//    };
//
//    self.quiet = function() {
//        if (dialogue) {
//            dialogue.remove();
//        }
//    };
//    self.isTalking = function() {
//        return dialogue && dialogue.isDisplayed();
//    };
//
//    self.loadAI = function(config) {
//        config['object'] = self;
//        ai = new AI(config);
//    };
//
//    self.startAI = function() {
//        if (!ai) return;
//        ai.start();
//    };
//
//    self.stopAI = function() {
//        if (!ai) return;
//        ai.stop();
//    };
//
//    self.removeAI = function() {
//        self.stopAI();
//        ai = false;
//    };
//
//    if (config.canDialogue) {
//        dialogue = new DialogueBox(this);
//    }
//
//    function _reloadObjectState() {
//
//        if (_util.isObject(self.animation)) {
//
//            // Clear Canvas
//            self.ctx.clearRect(
//                0, 0,
//                self.$container.width,
//                self.$container.height
//            );
//
//            // Store the object animation vector in a temporary object
//            var oav = sprite['animationVector'][self.animation.name];
//
//            // Redraw the image unto the canvas
//            self.$container.height = sprite['height'];
//            self.$container.width = sprite['width'];
//            if (sprite.hasOwnProperty('width') && sprite.hasOwnProperty('height')) {
//                self.ctx.drawImage(
//                    image, oav[self.animationIndex].x, oav[self.animationIndex].y,
//                    sprite['width'], sprite['height'],
//                    0, 0,
//                    self.$container.width, self.$container.height
//                );
//            }
//
//            if (self.animation.type === 'iterate') {
//
//                if (self.animationIndex + 1 < oav.length) {
//                    self.animationIndex++;
//                } else {
//                    self.flag = self.animation.flag;
//                    self.animation = undefined;
//                    self.block = false;
//                }
//
//            } else if (self.animation.type === 'loop') {
//
//                if (self.animationIndex + 1 < oav.length) {
//                    self.animationIndex++;
//                } else {
//                    self.animationIndex = 0;
//                }
//            }
//        }
//        if (self.isMoving()) {
//            var pos = {
//                    x: facing === _const.right ? (self.x + self.$container.width) : self.x,
//                    y: facing === _const.down ? (self.y + self.$container.height) : self.y
//                },
//                dimension = {height: self.height, width: self.width},
//                collided = collide && collision.check(pos, dimension, facing, self.range, self);
//            if (collided) {
//                self.event = {type: 'collision', data: collided};
//            }
//            else if (direction.up) {
//                collision.remove(self.id);
//                self.y -= self.range;
//                collision.add(self);
//            }
//            else if (direction.right) {
//                collision.remove(self.id);
//                self.x += self.range;
//                collision.add(self);
//            }
//            else if (direction.down) {
//                collision.remove(self.id);
//                self.y += self.range;
//                collision.add(self);
//            }
//            else if (direction.left) {
//                collision.remove(self.id);
//                self.x -= self.range;
//                collision.add(self);
//            }
//
//            self.$container.style.left = self.x + 'px';
//            self.$container.style.top = self.y + 'px';
//        }
//    }
//
//    function resize() {
//        var bounds = self.$container.getBoundingClientRect();
//        self.height = bounds.height;
//        self.width = bounds.width;
//        self.x = bounds.left;
//        self.y = bounds.top;
//    }
//}