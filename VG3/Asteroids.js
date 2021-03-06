var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', {
	preload: preload,
	create: create,
	update: update
});

var Type = {
	SHIP: 1,
	ASTEROID: 2,
	BULLET: 3
}

function preload() {
	game.load.spriteSheet('ship', 'assets/sprites/thrust_ship2.png');
	game.load.image('bullet', 'assets/sprites/shmup-bullet-rotated.png');
	game.load.image('asteroid1', 'assets/sprites/asteroid1.png');
	game.load.image('asteroid2', 'assets/sprites/asteroid2.png');
	game.load.image('asteroid3', 'assets/sprites/asteroid3.png');
}

var ship;
var bulletGroup;
var scoreText;
var score = 0;
var asteroidBig;
var asteroidMed;
var asteroidSmall;


function create() {

	game.stage.backgroundColor = '#000000';
	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);


	//CREATE SPRITES/GROUPS
	bulletGroup = game.add.group();
	asteroidBig = game.add.group();
	asteroidMed = game.add.group();
	asteroidSmall = game.add.group();

	//Create Ship sprite, then enable box2d body
	ship = game.add.sprite(game.world.centerX, game.world.centerY, 'ship');
	game.physics.box2d.enable(ship);
	//call makeShip on our ship sprite to add additional fields and methods
	makeShip(ship);

	//Set up arrow keys for input
	cursors = game.input.keyboard.createCursorKeys();

	//add test in the corner to display score
	scoreText = game.add.text(5, 25, 'score - ' + score, {
		fill: '#ffffff',
		font: '14pt Arial'
	});

	//spawn 2 big asteroids to start
	spawnBigAsteroid();
	spawnBigAsteroid();

	//spawn another big asteroid every 12 seconds
	var asteroidTimer = game.time.events.loop(Phaser.Timer.SECOND * 12, spawnBigAsteroid, this);

}

//this function is called when player kills an asteroid, it adds points to their score and updates scoreText to display their new score
function addScore(points) {
	score += points;
	scoreText.text = 'Score - ' + score;
}


//Phaser update function
function update() {
	//loop through all the different asteroid groups and call updateAsteroidA on each element
	asteroidBig.forEach(updateAsteroid, this);
	asteroidMed.forEach(updateAsteroid, this);
	asteroidSmall.forEach(updateAsteroid, this);

	//for each bullet, check if killNextStep is true and if so kill the bullets body
	bulletGroup.forEach(function (bul) {
		if (bul.body.killNextStep) {
			bul.body.kill();
		}
	}, this);

	//call ships own update function
	ship.update();

}

//call this function every frame on whatever sprites/bodies you want to wrap around the screen(when sprite goes off side of screen it reappears on the opposite side
function wrapScreen(sprite) {

	if (sprite.body.x < 0) {
		sprite.body.x = 800;
	} else if (sprite.body.x > 800) {
		sprite.body.x = 0;
	}

	if (sprite.body.y < 0) {
		sprite.body.y = 600;
	} else if (sprite.body.y > 600) {
		sprite.body.y = 0;
	}

}

//update asteroid function, called on each individual asteroid
function updateAsteroid(ast) {
	//if asteroid is supposed to be killed, do it now
	if (ast.body.killNextStep) {
		ast.body.kill();
	}

	//spawn asteroids = 2 when an asteroid of size 2(biggest size) dies, so when that's true spawn 2 asteroids of size medium
	if (ast.spawnAsteroids == 2) {
		spawnMedAsteroid(ast.x, ast.y);
		spawnMedAsteroid(ast.x, ast.y);
		ast.spawnAsteroids = 0;
		//if asteroid of size 1(medium) dies, spawn 3 small asteroids
	} else if (ast.spawnAsteroids == 1) {
		spawnSmallAsteroid(ast.x, ast.y);
		spawnSmallAsteroid(ast.x, ast.y);
		spawnSmallAsteroid(ast.x, ast.y);
		ast.spawnAsteroids = 0;
	}
	//call wrap screen on the asteroid
	wrapScreen(ast);
}

//Adds a new asteroid of the largest size into play
function spawnBigAsteroid() {

	//create asteroid in asteroidBig group, then enable box2d body
	var ast = asteroidBig.create(Math.random() * 800, Math.random() * 600, 'asteroid1');
	game.physics.box2d.enable(ast);
	//set body type and size
	ast.body.type = Type.ASTEROID;
	ast.size = 2;
	//randomize velocity
	ast.body.velocity.y = Math.random() * 150 - 75;
	ast.body.velocity.x = Math.random() * 150 - 75;
	//set spawnAsteroids to 0 so the update function doesn't spawn more asteroids randomly
	ast.spawnAsteroids = 0;
	//set collision callback. category 1 is used for all collisions and then .type is used to differentiate between collisions because non-1 categories aren't working atm
	ast.body.setCategoryContactCallback(1, asteroidContact, this);
}

//spawns a medium size asteroid into play, x/y parameters are location of parent asteroid so it knows where to spawn the new asteroids
function spawnMedAsteroid(x, y) {
	//create asteroid in asteroidMed group, random position. THen enable box2d body
	var ast = asteroidMed.create(x - 25 + (Math.random() * 50), y - 25 + (Math.random() * 50), 'asteroid2');
	game.physics.box2d.enable(ast);
	//set asteroid type and size
	ast.body.type = Type.ASTEROID;
	ast.size = 1;
	//set random velocity
	ast.body.velocity.y = Math.random() * 150 - 75;
	ast.body.velocity.x = Math.random() * 150 - 75;
	//set spawnAsteroids to 0 so it doesn't spawn random asteroids
	ast.spawnAsteroids = 0;
	//set collision callback. category 1 is used for all collisions and then .type is used to differentiate between collisions because non-1 categories aren't working atm
	ast.body.setCategoryContactCallback(1, asteroidContact, this);
}

//spawns a medium size asteroid into play, x/y parameters are location of parent asteroid so it knows where to spawn the new asteroids
function spawnSmallAsteroid(x, y) {
	//create asteroid in asteroidSmall group, random position. THen enable box2d body
	var ast = asteroidSmall.create(x - 25 + (Math.random() * 50), y - 25 + (Math.random() * 50), 'asteroid3');
	game.physics.box2d.enable(ast);
	//set asteroid type and size
	ast.body.type = Type.ASTEROID;
	ast.size = 0;
	//randomize velocity
	ast.body.velocity.y = Math.random() * 150 - 75;
	ast.body.velocity.x = Math.random() * 150 - 75;
	//set spawnAsteroids to 0 so it dosn't randomly spawn asteroids
	ast.spawnAsteroids = 0;
	//set collision callback. category 1 is used for all collisions and then .type is used to differentiate between collisions because non-1 categories aren't working atm
	ast.body.setCategoryContactCallback(1, asteroidContact, this);
}



function makeShip(sprite, power, turnSpeed, shootSpeed, shootInterval) {
	//set variables for ship. If none are specified as parameters use default values that I set manually
	sprite.power = power || 200;
	sprite.turnSpeed = turnSpeed || 150;
	sprite.shootSpeed = shootSpeed || 250;

	//set body type
	sprite.body.type = Type.SHIP;

	//update function for shipt
	sprite.update = update;

	function update() {
		//stop rotation so it doesn't keep spinning when arrow keys aren't pressed
		sprite.body.setZeroRotation();
		//make ship wrap around screen when it goes off screen
		wrapScreen(sprite);
		//Accelerate 
		if (cursors.up.isDown) {
			sprite.body.thrust(sprite.power);
		} else if (cursors.down.isDown) {
			sprite.body.thrust(-sprite.power);
		}

		//Turn
		if (cursors.left.isDown) {
			sprite.body.rotateLeft(sprite.turnSpeed);
		} else if (cursors.right.isDown) {
			sprite.body.rotateRight(sprite.turnSpeed);
		}

		//if z is pressed then shoot
		if (game.input.keyboard.isDown(Phaser.Keyboard.Z)) {
			if (game.time.now > sprite.shootTime)
				sprite.shoot();
		}
	}

	//set up variables to control rate of fire
	sprite.shootTime = game.time.now;
	sprite.shootInterval = shootInterval || 600;

	//set frontPoint relative to ship, this is where bullets will spawn when ship shoots
	sprite.frontPoint = new box2d.b2Vec2(0, -24)
	sprite.shootPoint = new box2d.b2Vec2(0, 0);

	//define vectors for shot velocity, so that toWorldPoint() can be used to convert a straight velocity to a slanted one based on ships rotation
	sprite.bulletVelocity = new box2d.b2Vec2(0, 200);
	sprite.shootVelocity = new box2d.b2Vec2(0, 0);

	//ships shoot function
	sprite.shoot = shoot;

	function shoot() {
		//reset shoot time so it can't shoot again instantly
		this.shootTime = game.time.now + this.shootInterval;
		//convert shootPOint to world space
		sprite.body.toWorldPoint(sprite.shootPoint, sprite.frontPoint);

		//console.log(game.physics.box2d.queryAABB(sprite.shootPoint.x - 25, sprite.shootPoint.y - 25, 50, 50).length);
		if (true || game.physics.box2d.queryAABB(sprite.shootPoint.x - 25, sprite.shootPoint.y - 25, 50, 50).length <= 1) {
			createBullet(sprite);
		} else {}
	}

}


function createBullet(sprite) {
	//create bullet in bullet group 
	var bullet = bulletGroup.create(sprite.shootPoint.x, sprite.shootPoint.y, 'bullet');
	//enable box2d body on bullet
	game.physics.box2d.enable(bullet);
	//set type to bullet so collision function knows how to react
	bullet.body.type = Type.BULLET;
	//set rotation to ships rotation then move forward relative to rotation. basically make the bullet shoot forward from the ship
	bullet.body.rotation = ship.body.rotation;
	bullet.body.moveForward(ship.shootSpeed);

	//check if bullet is out of bounds every frame and if so kill it
	bullet.checkWorldBounds = true;
	bullet.outOfBoundsKill = true;



}


//collision reaction function for asteroid + anything
function asteroidContact(body1, body2, fixture1, fixture2, begin, contact) {
	//only do something if begin is true, otherwise it is called many times instead of once per collision
	if (begin) {
		//if the other body is a bullet then kill the asteroid and the bullet and add 5 to score
		if (body1.type == Type.ASTEROID && body2.type == Type.BULLET) {
			body1.sprite.kill();
			body1.killNextStep = true;
			body1.sprite.spawnAsteroids = body1.sprite.size;
			addScore(5);
			body2.sprite.kill();
			body2.killNextStep = true;

			//if other body is ship then kill the ship. Game over
		} else if (body1.type == Type.ASTEROID && body2.type == Type.SHIP) {
			ship.kill();
			ship.body.kill();
		}
	}

}
