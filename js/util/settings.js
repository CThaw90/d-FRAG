/**
 * Created by christhaw on 1/10/16.
 */
var withInteractions = [
    {
        id: 'interact_with_tree_a',
        object: 'tree_a',
        trigger: 'main-character',
        type: _const.movement,
        config: {all: 10},
        does: function(object, trigger, collision) {
            var collided = null;
            if (collision.exists(object.id)) {
                var position = {
                    x: trigger.trajecting() === _const.faceRight ? trigger.x + trigger.width : trigger.x,
                    y: trigger.trajecting() === _const.faceDown ? trigger.y + trigger.height : trigger.y
                }, dimension = {height: trigger.height, width: trigger.width},
                    direction = trigger.trajecting(),
                    range = this.config.all;

                collided = collision.check(position, dimension, direction, range);
                if (collided && collided.collisionId === object.id) {
                    console.log(collided);
                }
            }
        }
    }//,
        //{
        //    id: 'interact_with_steel-door',
        //    object: 'steel-door',
        //    trigger: 'main-character',
        //    type: _const.movement,
        //    config: {all: 5},
        //    // Use Photo shop to make pictures bigger without losing pixel
        //    // quality to match the size of the character sprite
        //    does: function(object, trigger, collision) {
        //        object['animate']({name: 'animateOpen', type: 'iterate'});
        //    }
        //}
];
var withObjects = {
    mainCharacter: {
        sprite: _const.basePath + 'json/sprites/main-character.json',
        id: 'main-character'
    },
    stage: {
        backgroundImage: _const.basePath + 'img/stages/grass.png',
        id: 'main-stage',
        objects: [
            {load: _const.basePath + 'json/sprites/trees/tree_a.json', id: 'tree_a'},
            {load: _const.basePath + 'json/sprites/trees/tree_b.json', id: 'tree_b'},
            {load: _const.basePath + 'json/sprites/trees/tree_c.json', id: 'tree_c'},
            {load: _const.basePath + 'json/sprites/trees/tree_d.json', id: 'tree_d'},
            {load: _const.basePath + 'json/sprites/trees/tree_e.json', id: 'tree_e'},
            {load: _const.basePath + 'json/sprites/trees/tree_f.json', id: 'tree_f'},
            {load: _const.basePath + 'json/sprites/trees/tree_h.json', id: 'tree_h'},
            {load: _const.basePath + 'json/sprites/trees/tree_i.json', id: 'tree_i'},
            {load: _const.basePath + 'json/sprites/walls/stone-walls_a.json', id: 'stone-walls_a'},
            {load: _const.basePath + 'json/sprites/walls/stone-walls_b.json', id: 'stone-walls_b'},
        //    {load: _const.basePath + 'json/sprites/doors/steel-door.json', id: 'steel-door'}
        ]
    }
};

