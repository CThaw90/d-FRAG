/**
 * Created by christhaw on 8/3/16.
 */
define(['Squire', 'constants'], function (Squire, constants) {
    /* globals describe, it, xit, jasmine, beforeEach, spyOn */
    describe('Dialogue Module', function () {

        it('should be a valid object', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: jasmine.createSpyObj('stage', ['element'])
            }).require(['dialogue'], function (dialogue) {
                expect(dialogue).toEqual(jasmine.any(Object));
                expect(dialogue.box).toEqual(jasmine.any(Function));
                expect(dialogue.conversation).toEqual(jasmine.any(Function));

                done();
            });
        });
    });

    describe('Dialogue Module box component', function () {
        var stage = jasmine.createSpyObj('stage', ['element', 'appendChild', 'removeChild']);

        it('should set the parent element as the stage element', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {

                dialogue.box({});
                expect(stage.element).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should set the proper attributes that style and control a dialogue box', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var dialog = new dialogue.box({id: 'createDialogue'}),
                    self = dialog.returnSelf();

                expect(self.container.getAttribute('class')).toEqual('dialogue-box');
                expect(self.container.getAttribute('style')).toEqual('position: absolute');
                expect(self.container.getAttribute('id')).toEqual('dialogue-box-for-createDialogue');

                expect(self.arrow.getAttribute('class')).toEqual('dialogue-arrow');
                expect(self.arrow.getAttribute('style')).toEqual('position: absolute');
                expect(self.arrow.getAttribute('id')).toEqual('dialogue-arrow-for-createDialogue');
                done();
            });
        });

        it('should be able to show and hide the dialogue box', function (done) {
            var injector = new Squire(), entity = {id: 'entityDialog', height: 400, width: 200, y: 300, x: 100};
            stage.element.and.returnValue(document.createElement('div'));
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var dialog = new dialogue.box(entity), self = dialog.returnSelf(), GREETING = 'HELLO_WORLD';
                expect(self.parent.childNodes.length).toEqual(0);
                dialog.show(GREETING);

                expect(self.container.innerText).toEqual(GREETING);
                expect(self.container.textContent).toEqual(GREETING);
                expect(self.parent.childNodes.length).toEqual(2);

                expect(self.container.style.left).toEqual('200px');
                expect(self.container.style.top).toEqual('715px');

                expect(self.arrow.style.left).toEqual('200px');
                expect(self.arrow.style.top).toEqual('705px');
                expect(self.displayed).toBe(true);

                dialog.hide();

                expect(self.parent.childNodes.length).toEqual(0);
                expect(self.displayed).toBe(false);

                done();
            });
        });

        it('should determine whether the dialogue box is being displayed or not', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var dialog = new dialogue.box({});
                expect(dialog.isDisplayed()).toBe(false);

                dialog.hide();
                expect(dialog.isDisplayed()).toBe(false);

                dialog.show();
                expect(dialog.isDisplayed()).toBe(true);

                dialog.show();
                expect(dialog.isDisplayed()).toBe(true);

                dialog.hide();
                expect(dialog.isDisplayed()).toBe(false);

                dialog.hide();
                expect(dialog.isDisplayed()).toBe(false);

                done();
            });
        });
    });

    describe('Dialogue Module Conversation', function () {
        var object, entity, stage = jasmine.createSpyObj('stage', ['element']),
            conversationObject = getJSONFixture('json/conversation.json');

        beforeEach(function () {
            object = jasmine.createSpyObj('object', ['talk', 'quiet', 'isTalking']);
            object.id = 'object';

            entity = jasmine.createSpyObj('object', ['talk', 'quiet', 'isTalking']);
            entity.id = 'entity';
        });

        it('should properly create a dialogue conversation object', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var conversation = new dialogue.conversation([object, entity], conversationObject),
                    self = conversation.returnSelf();

                expect(conversation).toEqual(jasmine.any(Object));
                expect(conversation.conversing).toEqual(jasmine.any(Function));
                expect(conversation.end).toEqual(jasmine.any(Function));
                expect(conversation.next).toEqual(jasmine.any(Function));
                expect(conversation.restart).toEqual(jasmine.any(Function));
                expect(conversation.setIndex).toEqual(jasmine.any(Function));

                expect(self.conversation).toBe(conversationObject);
                expect(self.objects.object).toBe(object);
                expect(self.objects.entity).toBe(entity);
                expect(self.index).toEqual(0);
                expect(self.conversing).toBe(false);
                expect(self.checkStatus).toEqual(jasmine.any(Function));
                expect(self.validateConversation).toEqual(jasmine.any(Function));
                expect(self.id).toEqual(jasmine.any(String));
                expect(self.id).toBeFalsy();

                done();
            });
        });

        it('should validate a conversation object', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var conversation = new dialogue.conversation([entity, object]), self = conversation.returnSelf(),
                    invalidConversation = getJSONFixture('json/invalid_conversation.json');
                expect(self.validateConversation(invalidConversation.conversation)).toBe(false);
                expect(self.validateConversation(invalidConversation)).toBe(false);
                expect(self.validateConversation(conversationObject)).toBe(false);
                expect(self.validateConversation(conversationObject.conversation)).toBe(true);
                done();
            });
        });

        it('should properly execute a conversation object with object entities', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var conversation = new dialogue.conversation([entity, object], conversationObject), self = conversation.returnSelf();
                conversation.converse();

                expect(self.id).toEqual('conversation_between_character_and_mr_reed');
                expect(conversation.conversing()).toBe(true);

                conversation.next();
                expect(object.quiet).toHaveBeenCalledTimes(1);
                expect(object.talk).toHaveBeenCalledTimes(1);
                expect(object.talk).toHaveBeenCalledWith('Hello, there! I have learned to talk.');
                expect(self.index).toEqual(1);

                conversation.next();
                expect(object.quiet).toHaveBeenCalledTimes(2);
                expect(entity.talk).toHaveBeenCalledTimes(1);
                expect(entity.talk).toHaveBeenCalledWith('As have I. How art thou, Mr. Ree?');
                expect(self.index).toEqual(2);

                conversation.next();
                expect(entity.quiet).toHaveBeenCalledTimes(1);
                expect(object.talk).toHaveBeenCalledTimes(2);
                expect(object.talk).toHaveBeenCalledWith('I fare well. Thank you.');
                expect(self.index).toEqual(3);

                conversation.next();
                expect(object.quiet).toHaveBeenCalledTimes(3);
                expect(object.talk).toHaveBeenCalledTimes(3);
                expect(object.talk).toHaveBeenCalledWith('Wither thus thou go?');
                expect(self.index).toEqual(4);

                conversation.next();
                expect(object.quiet).toHaveBeenCalledTimes(4);
                expect(entity.talk).toHaveBeenCalledTimes(2);
                expect(entity.talk).toHaveBeenCalledWith('I am heading to the ends of the earth and beyond');
                expect(self.index).toEqual(5);

                conversation.next();
                expect(entity.quiet).toHaveBeenCalledTimes(2);
                expect(object.talk).toHaveBeenCalledTimes(4);
                expect(object.talk).toHaveBeenCalledWith('Ah. You\'d be wise to head south');
                expect(self.index).toEqual(6);

                conversation.next();
                expect(object.quiet).toHaveBeenCalledTimes(5);
                expect(entity.talk).toHaveBeenCalledTimes(3);
                expect(entity.talk).toHaveBeenCalledWith('Much obliged and much gratitude to you');
                expect(self.index).toEqual(7);

                conversation.next();
                expect(entity.quiet).toHaveBeenCalledTimes(3);
                expect(object.talk).toHaveBeenCalledTimes(5);
                expect(object.talk).toHaveBeenCalledWith('Do not mention it young lad.');
                expect(self.index).toEqual(8);

                conversation.next();
                expect(conversation.conversing()).toBe(false);
                expect(self.index).toEqual(0);
                done();
            });
        });

        it('should properly navigate through a conversation object', function (done) {
            var injector = new Squire();
            injector.mock({
                stage: stage
            }).require(['dialogue'], function (dialogue) {
                var conversation = new dialogue.conversation([entity, object], conversationObject),
                    self = conversation.returnSelf();
                conversation.converse();
                conversation.setIndex(4);
                conversation.next();

                expect(object.quiet).toHaveBeenCalledTimes(2);
                expect(object.talk).not.toHaveBeenCalled();
                expect(entity.talk).toHaveBeenCalled();
                expect(entity.talk).toHaveBeenCalledWith('I am heading to the ends of the earth and beyond');

                conversation.restart();
                conversation.next();

                expect(object.talk).toHaveBeenCalledTimes(1);
                expect(object.talk).toHaveBeenCalledWith('Hello, there! I have learned to talk.');

                conversation.next();
                expect(entity.talk).toHaveBeenCalledWith('As have I. How art thou, Mr. Ree?');

                conversation.end();
                conversation.next();

                expect(conversation.conversing()).toBe(false);
                expect(self.index).toEqual(0);
                done();
            });
        });
    });
});