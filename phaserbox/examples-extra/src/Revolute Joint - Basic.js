
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.image('a', 'assets/sprites/a.png');
	game.load.image('b', 'assets/sprites/b.png');

}

var codeCaption;
var spriteA;
function create() {
	
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.debugDraw.joints = true;
	game.physics.box2d.gravity.y = 500;

    
    //The most basic revolute joint. Anchors at the center of each sprite and no motor or limits enabled
    {
		// Static box
		spriteA = game.add.sprite(game.world.centerX, game.world.centerY, 'a');
		game.physics.box2d.enable(spriteA);
		spriteA.body.static = true;
		
		// Dynamic box
		var spriteB = game.add.sprite(game.world.centerX, game.world.centerY, 'b');
		game.physics.box2d.enable(spriteB);
		
		// bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
		game.physics.box2d.revoluteJoint(spriteA, spriteB);
    }
    
	// Set up handlers for mouse events
	game.input.onDown.add(mouseDragStart, this);
	game.input.addMoveCallback(mouseDragMove, this);
	game.input.onUp.add(mouseDragEnd, this);
	
	game.add.text(5, 5, 'A basic revolute joint, Click to begin, then use your mouse to spin Box B', { fill: '#ffffff', font: '14pt Arial' });
	codeCaption = game.add.text(5, 30, 'Parameters: bodyA, bodyB', { fill: '#dddddd', font: '10pt Arial' });
	codeCaption = game.add.text(5, 45, 'game.physics.box2d.revoluteJoint(spriteA, spriteB)', { fill: '#ccffcc', font: '14pt Arial' });
	
	// Start paused so user can see how the joints start out
	game.paused = true;
	game.input.onDown.add(function(){game.paused = false;}, this);
}

function mouseDragStart() { game.physics.box2d.mouseDragStart(game.input.mousePointer); }
function mouseDragMove() {  game.physics.box2d.mouseDragMove(game.input.mousePointer); }
function mouseDragEnd() {   game.physics.box2d.mouseDragEnd(); }

function update() {
	
}

function render() {
	
	// update will not be called while paused, but we want to change the caption on mouse-over
	if ( game.paused ) {
		update();
	}
	
	game.debug.box2dWorld();
	
}