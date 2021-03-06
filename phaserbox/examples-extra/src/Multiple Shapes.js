
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });


function preload() {
    game.load.image('tetris', 'assets/sprites/tetrisblock1.png');
    
}


var caption;
var isSingle = true;
var currentlySpawning;
var staticBlockSingle;
var staticBlockMultiple;
function create() {
    
	game.stage.backgroundColor = '#124184';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
    
	game.physics.box2d.gravity.y = 500;
    game.physics.box2d.setBoundsToWorld();
    game.physics.box2d.restitution = 0;
    
    //create a static tetris sprite with only 1 shape/fixture. touch/click input
    staticBlockSingle = game.add.sprite(700, 200, 'tetris');
    game.physics.box2d.enable(staticBlockSingle);
    staticBlockSingle.body.static = true;
    staticBlockSingle.inputEnabled = true;
    staticBlockSingle.events.onInputDown.add(singleClick, this);
    
    
    //create a static tetris sprite with multiple shapes/fixtures, enable to
    staticBlockMultiple = game.add.sprite(100, 200, 'tetris');
    game.physics.box2d.enable(staticBlockMultiple);
    staticBlockMultiple.body.static = true;
    staticBlockMultiple.body.setRectangle(48, 48, -24, 0, 0);
    staticBlockMultiple.body.addRectangle(48, 48, 24, 0, 0);
    staticBlockMultiple.body.addRectangle(48, 48, 24, 48, 0);
    staticBlockMultiple.body.addRectangle(48, 48, 24, -48, 0);
    staticBlockMultiple.body.rotation = Math.PI
    staticBlockMultiple.inputEnabled = true;
    staticBlockMultiple.events.onInputDown.add(multiClick, this);
    
    
    caption = game.add.text(5, 25, '', { fill: '#ffffff', font: '14pt Arial' });
    currentlySpawning = 'Single';
    updateCaption();
    
    //callback for mouseDown or touchDown event
    game.input.onDown.add(worldClick, this);
    
}

function createTetrimino() {
    
    //create a tetrimino sprite and enable box2d body
    var block = game.add.sprite(game.input.x, game.input.y, 'tetris');
    game.physics.box2d.enable(block);
    
    //if the user chose to create multiple body tetriminos, then replace the original body with 4 little ones corresponding to eacn block
    if (!isSingle) {
        block.body.setRectangle(48, 48, -24, 0, 0);
        block.body.addRectangle(48, 48, 24, 0, 0);
        block.body.addRectangle(48, 48, 24, 48, 0);
        block.body.addRectangle(48, 48, 24, -48, 0);   
    }
}


function worldClick(pointer) {
    //check click to make sure the user wasn't clicking one of the static tetriminos. If they weren't, then spawn a tetrimino
    if (!staticBlockSingle.input.pointerOver() && !staticBlockMultiple.input.pointerOver()) {
        createTetrimino();
    }
}


//if user clicks the single body static tetrimino, start spawning single body tetriminos when he/she clicks the screen.
function singleClick() {
    isSingle = true;
    currentlySpawning = 'Single';
    updateCaption();
}


//if user clicks the multi body static tetrimino, start spawning multi-body tetriminos wherever he/she clicks the screen
function multiClick() {
    isSingle = false;
    currentlySpawning = 'Multiple'
    updateCaption();
    console.log(currentlySpawning);
}

//update caption to indicate what kind of tetriminos are currently being spawned.
function updateCaption() {
    caption.text = "Click the multi-body piece(left) to start spawning multi-body tetriminos. \nClick the single-body piece(right) to spawn single-body tetriminos\ncurrently spawning: " + currentlySpawning;
        
}

function render() {
	
	game.debug.box2dWorld();
	
}
