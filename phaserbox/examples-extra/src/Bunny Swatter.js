
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render, update: update });

function preload() {
    game.load.image('bunny', 'assets/sprites/bunny.png');
    game.load.image('block', 'assets/sprites/block.png');
    game.load.spritesheet('explosion', 'assets/sprites/explosion.png', 64, 64);
}

var bunnies = [];
function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
    
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.restitution = 0.5;
    
    // Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
    
    game.add.text(5, 5, 'Click and drag the top box to swing your swatter, hit the bunnies with \nthe big swatter box to kill them!', { fill: '#ffffff', font: '14pt Arial' });
    
    
    //Create a column of 12 blocks, connect each one to the previous one with a revolute joint to make a 
    var blocks = [];
    for (var i = 0; i < 12; i++) {
        blocks[i] = game.add.sprite(game.world.centerX, 50 + (i * 36), 'block');
        blocks[i].scale.set(0.2);
        game.physics.box2d.enable(blocks[i]);
        if (i > 0) 
             game.physics.box2d.revoluteJoint(blocks[i-1].body, blocks[i].body, 0, 10, 0, -10);
    }
    
    //Create a larger box and attach it to the last of the other boxes. This will be the 'swatter' piece
    var swatter = game.add.sprite(game.world.centerX, 440, 'block');
    game.physics.box2d.enable(swatter);
    game.physics.box2d.revoluteJoint(swatter.body, blocks[11], 0, 10, 0, -10);
    
    
    //create 20 bunny sprites with box2d bodies attached
    for (var i = 0; i < 20; i++) {
        bunnies[i] = game.add.sprite(Math.random() * game.world.width, Math.random() * game.world.height, 'bunny');   
        bunnies[i].scale.set(0.1);
        game.physics.box2d.enable(bunnies[i]);
        
        bunnies[i].body.owner = bunnies[i];
        swatter.body.setBodyContactCallback(bunnies[i], swat, this);
    }
    
    
    
}

function update() {
    //loop through all the bunnies and apply force in a random direction. 
    for (var i = 0; i < 20; i++) {
        if (bunnies[i].alive) {
            bunnies[i].body.applyForce(Math.random() * 10 - 5, Math.random() * 10 - 5);
        }
    }
}

//This is the contact callback function. body1 is the swatter and body2 is the bunny it is hitting. This kills the bunny and plays an explosion animation
function swat(body1, body2, fixture1, fixture2, begin) {
    //explode
    var explosion = game.add.sprite(body2.x, body2.y, 'explosion');
    explosion.smoothed = false;
    explosion.animations.add('explode', null, 30, false);
    explosion.play('explode');
    
    //kill bunny
    body2.owner.kill();
    body2.destroy();
}


// call built-in box2d functions to drag bodies around the screen with mouse.
function mouseDragStart() { game.physics.box2d.mouseDragStart(game.input.mousePointer); }
function mouseDragMove() {  game.physics.box2d.mouseDragMove(game.input.mousePointer); }
function mouseDragEnd() {   game.physics.box2d.mouseDragEnd(); }

function render() {
	
	// game.debug.box2dWorld();
	
}
