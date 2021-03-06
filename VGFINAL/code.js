var game = new Phaser.Game(900, 500, Phaser.CANVAS, 'phaser', {
	//preload: preload,
	create: create,
	update: update,
	render: render
});
game.scaleMode = Phaser.ScaleManager.EXACT_FIT;
game.antialias = false;
var screen = "game";
var groundBody = [0, 0];
var thrustP;
var car = [golfCart, truck, apc, foodCart, atv, tank, nascar, hyperBike, monsterTruck, threeWheeler, dumpTruck, jeep, snowmobile, bus, hotrod, rover, racecar, dirtBike, groceryCart, chopper]; //Load all the cars
//var selection = 10; //CURRENTLY SELECTED CAR (PRESET)
var selection = Math.floor(Math.random() * car.length); //CURRENTLY SELECTED CAR (RANDOM)
var graphics;
var chunk;
var turnSpeed;
var vehicleVertices = [];
var graphicsLvl = 0;
//Car selection
var Phaser;
var cursors;
var vehicleBody;
var moreGroundOne;
var moreGroundTwo;
var com;
var flipr;
var flipr2;
var bodySprite = car[selection];
var cameraScale = 2;
var score;
var score2 = 0;
var cscore;
var carName;
var randomNum = (0.5 - Math.random());
var yPlaceholder = 0;

var sSelection = 1; //Stage selection
var groundVertices;
var gStats = groundVertices[sSelection];

function hyperChunk() {
	return (((Math.floor((game.camera.x) / 5000)) / 4) - 0.75);
}
var terCalc =

	function terCalc() {

	}
var runMax = -80;
var backLim;
//upgrades
var susUp;
var tirUp;
var sID;

var chunkNum = 0;
var cCar = car[selection]; //get body collision data for selected car
var cCarWheel = car[selection].carWheel; //get wheel data for selected car 
var cCarPart = car[selection].carParts; //get extra part data for selected car

var cCarX;
var cCarY;
var driveJoints = [];
var partJoints = [];
var partJoints2 = [];
var undefF;
var roSpeed;
var document;
var moreGroundOne = [];
var moreGroundTwo = [];
var sect;
var chunkValue;
var sectOne = true;
var sectTwo = false;
var i = 0;
var amplitude = 50;
var wavelength = 50;

var temp;
var temp2;
var groundGen = [];
var startPoint = groundVertices[sSelection].length;
var vMax;
var tempv;
var mouse;
var scorei = 0;
var vPF;

var thrustpresent;
//function preload() {
//game.load.image('thrustfire', 'assets/sprites/particles/thrustfire.png');
//}
function leftInput() {
	return ((cursors.left.isDown) || ((mouse.pointer1.isDown && ((mouse.pointer1.position.x >= 0) && (mouse.pointer1.position.x <= 400))) || (mouse.pointer2.isDown && ((mouse.pointer2.position.x >= 0) && (mouse.pointer2.position.x <= 400)))));
}

function rightInput() {
	return ((cursors.right.isDown) || ((mouse.pointer1.isDown && ((mouse.pointer1.position.x >= 500) && (mouse.pointer1.position.x <= 900))) || (mouse.pointer2.isDown && ((mouse.pointer2.position.x >= 500) && (mouse.pointer2.position.x <= 900)))));
}

function create() {
	mouse = game.input;
	var caption = game.add.text(5, 5, 'Left/right arrow keys to move, up arrow to reset!', {
		fill: '#ffffff',
		font: '14pt Arial'
	});

	score = game.add.text(5, 26, 'High score: N/A', {
		fill: '#ffffff',
		font: '14pt Arial'
	});
	cscore = game.add.text(200, 26, 'Score: 0', {
		fill: '#ffffff',
		font: '14pt Arial'
	});
	carName = game.add.text(5, 46, '', {
		fill: '#00ffff',
		font: '16pt Arial'
	});
	thrustpresent = game.add.text(-100, 105, 'Left+Right to use thrusters on this vehicle!', {
		fill: '#afafaf',
		font: '14pt Arial'
	});
	sID = game.add.text(5, -1, '', {
		fill: '#989898',
		font: '7pt Arial'
	});
	sID.fixedToCamera = true;

	var specAbility;
	var headerText;
	var specAttribute;
	caption.fixedToCamera = true;
	score.fixedToCamera = true;
	cscore.fixedToCamera = true;
	carName.fixedToCamera = true;
	refresh();
	continuousTerrainGen2();
	//var moreGroundTwo = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	//var moreGroundOne = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	//moreGroundTwo.setChain([0, 0]);
	//moreGroundOne.setChain([0, 0]);
	//var chunk = ((Math.floor(vehicleBody.x / 5000)) / 4) + 0.75;
}

function vp1() {
	var vCC = cCar;
	var vWC = cCarWheel;
	temp = 0;
	for (var iV = 0; iV < vCC.carNumWheels; iV++) temp += ((vWC[iV].xPos + vWC[iV].height) * (vWC[iV].size + vWC[iV].grip + vWC[iV].active));
	return temp;
}
// Make the ground body
function refresh() {
	if (graphicsLvl == 1) {
		game.antialias = false;
		canvas.CanvasRenderingContext2D = false;
	} else if (graphicsLvl == 2) {
		canvas.CanvasRenderingContext2D = true;
		game.antialias = true;
	} else if (graphicsLvl == 3) {

	} else {

	}
	gStats = groundVertices[sSelection];
	startPoint = groundVertices[sSelection].length;
	cCar = car[selection]; //get body collision data for selected car
	cCarWheel = car[selection].carWheel; //get wheel data for selected car 
	cCarPart = car[selection].carParts; //get extra part data for selected car
	i = 0;
	tempv = 0;
	runMax = -80;
	moreGroundOne = [];
	moreGroundTwo = [];
	yPlaceholder = 0;
	chunkNum = 0;
	gStats.s1 = gStats.ss1;
	gStats.s2 = gStats.ss2;
	gStats.s3 = gStats.ss3;
	gStats.ssss1 = gStats.sssss1;
	groundGen = [0, 0];
	sectOne = true;
	sectTwo = false;
	carName.text = cCar.name;
	game.world.setBounds(-10000, -50000, Infinity, Infinity);
	game.desiredFps = 30;
	game.stage.backgroundColor = '#203050';

	// Enable Box2D physics
	game.physics.startSystem(Phaser.Physics.BOX2D);
	game.physics.box2d.gravity.y = (279 * gStats.grav);
	game.physics.box2d.friction = (0.26 * gStats.grip);
	game.physics.box2d.restitution = 0;

	//enable touch input
	cursors = game.input.keyboard.createCursorKeys();
	var groundBody = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	//maybe helps performance?
	groundBody.setChain(groundVertices[sSelection].data);
	groundBody.autoCull = true;
	groundBody.restitution = (0 + gStats.boing);


	var jointAnchor = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0); //car limit physics
	jointAnchor.setPolygon[10, 10, 10, -10, -10, -10, -10, 10];
	jointAnchor.setCollisionMask(0);

	// Make the car body
	vehicleVertices = cCar.carVertices;
	vehicleBody = new Phaser.Physics.Box2D.Body(this.game, null);
	vehicleBody.setPolygon(vehicleVertices);
	vehicleBody.mass = (cCar.carMass * 0.45);
	vehicleBody.autoCull = false;
	//Massdata = vehicleBody.getMass(); //get the mass data from you body
	/** Set the position of the shape's centroid relative to the shape's origin. **/
	cCarX = vehicleBody.x;
	cCarY = vehicleBody.y;
	com = new Phaser.Physics.Box2D.Body(this.game, null, cCarX + cCar.carMassX, cCarY + cCar.carMassY);
	com.setCircle(2.5);
	com.setCollisionMask(0);
	com.mass = (cCar.carMass * 0.55);
	game.physics.box2d.weldJoint(vehicleBody, com, cCarX + cCar.carMassX, cCarY + cCar.carMassY);
	//console.log(com);
	//comCam = new Phaser.Physics.Box2D.Body(this.game, null, cameraScale * 400, cameraScale * -300)
	//game.physics.box2d.weldJoint(vehicleBody, comCam, (cameraScale * 400), (cameraScale * -300))

	//data.center.set(10, 10);
	//vehicleBody.setMassData(data);
	// bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
	flipr = game.physics.box2d.motorJoint(jointAnchor, vehicleBody, cCar.airResist * 0.001, cCar.tilt, null);
	//flipr = game.physics.box2d.motorJoint(jointAnchor, vehicleBody, 0, cCar.tilt, null);

	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled
	flipr2 = game.physics.box2d.wheelJoint(jointAnchor, vehicleBody, null, null, null, null, null, null, null, null, null, cCar.agility, null, cCar.rotateSpeed, true)
	// Make the wheel bodies



	var wheelBodies = [];
	for (var i7 = 0; i7 < cCar.carNumWheels; i7++) {
		wheelBodies[i7] = new Phaser.Physics.Box2D.Body(this.game, null, cCarWheel[i7].xPos, cCarWheel[i7].height, 2);
		wheelBodies[i7].setCircle(cCarWheel[i7].size);
		wheelBodies[i7].friction = cCarWheel[i7].grip;
		wheelBodies[i7].mass = cCarWheel[i7].mass;
		wheelBodies[i7].autoCull = false;
		if (cCarWheel[i7].bounce != undefF) {
			wheelBodies[i7].restitution = cCarWheel[i7].bounce;
		}
		//wheelBodies[i7].setBodyContactCallback(groundBody, bodyCollide, this);
		//wheelBodies[i].restitution = cCarWheel[i].bounce - 1;
	}
	var motorTorque = cCar.carPower;
	// Make wheel joints
	// bodyA, bodyB, ax, ay, bx, by, axisX, axisY, frequency, damping, motorSpeed, motorTorque, motorEnabled	
	for (var i4 = 0; i4 < cCar.carNumWheels; i4++) {
		driveJoints[i4] = game.physics.box2d.wheelJoint(vehicleBody, wheelBodies[i4], cCarWheel[i4].xPos, cCarWheel[i4].height, 0, 0, cCarWheel[i4].susAngle + 0, 1, cCarWheel[i4].springs, cCarWheel[i4].damping, 0, motorTorque * cCarWheel[i4].active, true);
		driveJoints[i4].motorTorque = (cCar.rotateSpeed);
	}
	var partBodies = [];
	// create extra parts
	for (var i2 = 0; i2 < cCar.carNumParts; i2++) {
		partBodies[i2] = new Phaser.Physics.Box2D.Body(this.game, null, cCarPart[i2].xPos, cCarPart[i2].yPos);
		partBodies[i2].setPolygon(cCarPart[i2].vertices);
		partBodies[i2].mass = cCarPart[i2].mass;
		partBodies[i2].friction = cCarPart[i2].grip;
		partBodies[i2].autoCull = false;
	}
	for (var i5 = 0; i5 < cCar.carNumParts; i5++) {
		// bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
		if (cCarPart[i5].partType == 0) {
			partJoints[i5] = game.physics.box2d.revoluteJoint(vehicleBody, partBodies[i5], cCarPart[i5].xPos + cCarPart[i5].xOff, cCarPart[i5].yPos + cCarPart[i5].yOff, cCarPart[i5].xOff, cCarPart[i5].yOff, null, null, false, cCarPart[i5].limCounterclockwise, cCarPart[i5].limClockwise, true);
			partJoints2[i5] = game.physics.box2d.motorJoint(vehicleBody, partBodies[i5], null, cCarPart[i5].spring, cCarPart[i5].torque, 0, cCarPart[i5].correctionAngle, cCarPart[i5].correctionAngle);
		} else
			// bodyA, bodyB, ax, ay, bx, by, motorSpeed, motorTorque, motorEnabled, lowerLimit, upperLimit, limitEnabled
			if (cCarPart[i5].partType == 2) {
				partJoints2[i5] = game.physics.box2d.motorJoint(vehicleBody, partBodies[i5], cCarPart[i5].xPos, cCarPart[i5].yPos, cCarPart[i5].xOff, cCarPart[i5].yOff, cCarPart[i5].spring, cCarPart[i5].torque)
			} else
				// bodyA, bodyB, maxForce, maxTorque, correctionFactor, offsetX, offsetY, offsetAngle
				if (cCarPart[i5].partType == 1) {
					partJoints2[i5] = game.physics.box2d.weldJoint(vehicleBody, partBodies[i5], cCarPart[i5].xPos + cCarPart[i5].xOff, cCarPart[i5].yPos + cCarPart[i5].yOff, cCarPart[i5].xOff, cCarPart[i5].yOff, cCarPart[i5].spring, cCarPart[i5].torque)
				}
	}
	var groundGen;
	game.camera.follow(vehicleBody);
	//mouse = game.input.pointer.isDown;
	//game.camera.width = 800;
	//game.camera.height = 500;
	//console.log(comCam);
	//console.log(game.camera);

	//var chunk = (((Math.floor((game.camera.x) / 5000)) / 4) + 0.75);
	moreGroundTwo = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	moreGroundOne = new Phaser.Physics.Box2D.Body(this.game, null, 0, 0, 0);
	roSpeed = cCar.rotateSpeed;
	sID.text = ('vID: ' + vPFf(vp2(vp1())));
	if (selection == 15) {
		thrustpresent.text = 'Left+Right to use thrusters on this vehicle!';
	} else {
		thrustpresent.text = ' ';
	}
}

function bodyCollide(cCarWheel, groundBody, fixture1, fixture2, begin, contact) {
	var rPower = 1000;
}

function update() {

	if (com.x - 700 > runMax) {
		runMax = com.x - 700;

	} else if (com.x <= runMax && com.velocity.x < 0) {
		com.velocity.x = 20;
		vehicleBody.velocity.x = 20;
		com.x++;
		vehicleBody.x = vehicleBody.x + 1;
	}


	if (sSelection != 0) {
		continuousTerrainGen2();
	}

	if (selection != 16) {
		thrustP = 110 * cCar.downforce; //regular downforce code

	} else {
		//racecar downforce code
		if (vehicleBody.angle > -65 && vehicleBody.angle < 90 && vehicleBody.velocity.x >= 250) {
			thrustP = Math.abs((vehicleBody.velocity.x * 2));
		} else {
			thrustP = 150;
		}
	}

	var motorSpeed = cCar.carMaxSpeed; // rad/s
	var turnSpeed = 1 + cCar.agility;
	var motorEnabled = true;
	var motorEnabled2 = true;
	vehicleBody.reverse(thrustP * 0.5);
	com.reverse(thrustP * 0.5);

	if ((rightInput() && leftInput()) && selection == 15) {
		//moon rover downforce code
		vehicleBody.reverse(100 * gStats.grav * 1.5);
		com.reverse(-565 * gStats.grav * 1.5);
		motorEnabled = false;
		motorEnabled2 = false;

	} else if ((rightInput() && leftInput()) && selection != 15) {
		motorEnabled = false;
		motorEnabled2 = false;

	} else if ((leftInput() && !(rightInput()))) {
		turnSpeed = Math.abs(turnSpeed);
		roSpeed = Math.abs(roSpeed);
		if (vehicleBody.velocity.x <= 20) {
			motorSpeed = -1 * Math.abs(motorSpeed);
		} else {
			motorSpeed = 0;
		}

	} else if ((rightInput() && !(leftInput()))) {
		//motorEnabled2 = true;
		turnSpeed = -1 * Math.abs(turnSpeed);
		roSpeed = -1 * Math.abs(roSpeed);
		if (vehicleBody.velocity.x >= -20) {
			motorSpeed = Math.abs(motorSpeed);
		} else {
			motorSpeed = 0;
		}

	} else {
		motorEnabled = false;
		motorEnabled2 = false;
		if (cursors.up.justDown) {
			refresh();
		}
	}

	if (scorei > 39) {
		if ((vehicleBody.x > score2) && (selection != 15)) {
			score2 = vehicleBody.x;
			vMax = (Math.floor((vehicleBody.x) / 5) * 5);
			if (selection != 15) {
				score.text = ('High score: ' + vMax);
			}

			scorei = 0;
		}
		if (selection != 15) {
			cscore.text = ('Score: ' + (Math.floor((vehicleBody.x) / 5) * 5));
		} else {
			cscore.text = ('Score: N/A');
		}
	} else {
		scorei++;
	}
	flipr2.SetMotorSpeed(roSpeed);
	flipr2.EnableMotor(motorEnabled2);

	for (var i3 = 0; i3 < cCar.carNumWheels; i3++) {
		driveJoints[i3].EnableMotor(motorEnabled);
		driveJoints[i3].SetMotorSpeed(motorSpeed * cCarWheel[i3].active);
	}
}

function render() {
	game.debug.box2dWorld();
}
