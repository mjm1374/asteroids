//initialize the environment
const version = 1.34,
	deltaTime = 20,
	lifeStart = 3,
	jumpStart = 3,
	newLifeTarget = 10000,
	rockID = 0, //for debugging only
	mode = 'asteroids',
	modal = document.querySelector('#welcomeModel'),
	modalDialog = document.querySelector('.modal-dialog'),
	dialogCloseBtn = document.querySelector('.dialogCloseBtn');

let asteroids = [],
	shots = [],
	shotCnt = 0,
	xLimit = resetWindowLimit('x') - 1,
	yLimit = resetWindowLimit('y') - 1,
	spaceship = new Spaceship(xLimit / 2, yLimit / 2, 0, 0, 0, 0, 0, 0),
	spawnBox = new SpawnBox(xLimit / 2 - 50, yLimit / 2 - 50),
	lifeCnt = lifeStart,
	jumpCnt = jumpStart,
	score = 0,
	newLife = newLifeTarget,
	resetGun = true,
	inPlay = false,
	rockCnt = 10,
	scale = 1,
	ufo = new Ufo(-100, -100, 0, 0, 0, 0, 200),
	nextEnemy = Math.floor(getRandomFloat(10, 30) * 1000),
	enemyDelay = 2000,
	enemyUFO = [],
	ufoShots = [],
	ufoShotCnt = 0,
	ufoActive = false,
	ufoShootingSpeed = 1000,
	ufoAimStart = 50,
	ufoAim = 50,
	ufoScale = 0.1,
	ufoMaxSpeed = 3,
	ufoMinSpeed = 1,
	ufoSizeVar = 10,
	ufoTimer = null,
	ufoZigZagCnt = 0,
	ufoZigZagMaxCnt = 3,
	turn = 0,
	thrust = 0,
	turn_per_milli = 0.1,
	thrust_per_milli = 0.00015,
	key_delay = 50,
	del_v = 0,
	del_vx = 0,
	del_vy = 0,
	rock_max_v = 1.5,
	rock_max_v_cap = 6,
	screenScale = 1,
	scoreNum = null,
	versionNum = null,
	lifeNum = null,
	highScoreCnt = null,
	ufoSnd = null,
	extraLifeSnd = null,
	ufoBoomSnd = null,
	ufoBulletSnd = null,
	shootSnd = null,
	thrustSnd = null,
	turnSnd = null,
	hyperpaceSnd = null,
	hyperSpaceFailSnd = null,
	boomSnd = null,
	astroBoom100Snd = null,
	astroBoom50Snd = null,
	astroBoom25Snd = null,
	saucerBigSnd = null,
	saucerSmallSnd = null,
	beat1Snd = null,
	beat2Snd = null,
	spaceShipSvg = null,
	gameWrapper = null,
	gameOverBoard = null,
	startOver = null,
	isMobile = false,
	beatCnt = 1000,
	firstRun = true,
	heartbeat = null,
	soundless = false,
	randomBG = false,
	currentYear = new Date().getFullYear(),
	deg2rad = Math.PI / 180;

//conditional mobile vars
if (xLimit < 414) {
	screenScale = 1;
	rockCnt = 5;
	isMobile = true;
}

// MAIN ANIMATION LOOP -----------------------------------------------------------------------------------------

/**
 * The main animation loop
 */
const animateScreen = () => {
	hideCursor();
	updateAsteroids();
	checkUFO();
	updateShots();
	updateUFOShot();
	updateSpaceShip(deltaTime);
	updateScoreCard();
};

// END animation Loop -------------------------------------------------------------------------------------------

/**
 * Controls to update the score, life and Hyperspace count
 */
const updateScoreCard = () => {
	scoreNum.innerText = score;
	lifeNum.innerText = lifeCnt;
	highScoreCnt.innerText = jumpCnt;
};

/**
 * update the asteroids position
 */
const updateAsteroids = () => {
	for (let key in asteroids) {
		if (asteroids.hasOwnProperty(key)) {
			asteroids[key].changePosition(
				asteroids[key].x + asteroids[key].xv,
				asteroids[key].y + asteroids[key].yv
			);

			if (mode == 'asteroids') {
				if (
					asteroids[key].x <= 0 - asteroids[key].width ||
					asteroids[key].x >= xLimit + asteroids[key].width
				) {
					if (asteroids[key].x >= xLimit + asteroids[key].width) {
						asteroids[key].x = -Math.abs(0 - asteroids[key].width);
					} else {
						asteroids[key].x = xLimit + asteroids[key].width;
					}
				}

				if (
					asteroids[key].y <= 0 - asteroids[key].width ||
					asteroids[key].y >= yLimit + asteroids[key].height
				) {
					if (asteroids[key].y >= yLimit + asteroids[key].height) {
						asteroids[key].y = -Math.abs(0 - asteroids[key].height);
					} else {
						asteroids[key].y = yLimit + asteroids[key].height;
					}
				}
			}

			// cheeck for collision
			if (inPlay == true) {
				if (inCollision(asteroids[key])) {
					boom();
				}
			}
		}

		let thisRock = document.querySelector(`#rockAnim${asteroids[key].id}`);
		moveItem(thisRock, asteroids[key].x, asteroids[key].y);
	} //end asteroids
};

/**
 * Check on the status of the UFO
 */
const checkUFO = () => {
	if (ufo != null && ufo != undefined && ufoActive == true) {
		ufo.changePosition(ufo.x + ufo.vx, ufo.y + ufo.vy);
		if (ufo.x > xLimit + 100) {
			parkUFO();
			spawnEnemy();
		}
		if (ufo.x < -60 && ufo.x > -199) {
			parkUFO();
			spawnEnemy();
		}
		let thisUfo = document.querySelector('#ufoShip');
		moveItem(thisUfo, ufo.x, ufo.y);
		// paint the ufo
	}
};

/**
 * Update the bullets
 */
const updateShots = () => {
	for (let idx in shots) {
		let thisVX =
			Math.cos((shots[idx].theta * Math.PI) / 180) * 10 + shots[idx].x;
		let thisVY =
			Math.sin((shots[idx].theta * Math.PI) / 180) * 10 + shots[idx].y;
		let thisLife = shots[idx].life - 5;
		shots[idx].changeLife(thisLife);

		if (shots[idx].life < 0) {
			clearBullet('sp', idx);
		} else {
			shots[idx].changePosition(thisVX, thisVY);
			let thisShot = document.querySelector(
				`#spaceshipShot${shots[idx].id}`
			);
			moveItem(thisShot, shots[idx].x, shots[idx].y);
			// paint the shot

			if (isHit(shots[idx])) {
				clearBullet('sp', idx);
			} else {
				if (isUfoHit(shots[idx])) {
					clearBullet('sp', idx);
				}
			}
		}
	}
};

/**
 * update the UFO bullters
 */
const updateUFOShot = () => {
	for (let ind in ufoShots) {
		let thisUfoVX =
			Math.cos((ufoShots[ind].theta * Math.PI) / 180) * 10 +
			ufoShots[ind].x;
		let thisUfoVY =
			Math.sin((ufoShots[ind].theta * Math.PI) / 180) * 10 +
			ufoShots[ind].y;
		let thisUfoLife = ufoShots[ind].life - 5;
		ufoShots[ind].changeLife(thisUfoLife);

		if (ufoShots[ind].life < 0) {
			clearBullet('ufo', ind);
		} else {
			ufoShots[ind].changePosition(thisUfoVX, thisUfoVY);

			let thisUfoShot = document.getElementById(
				'ufoshot' + ufoShots[ind].id
			);

			moveItem(thisUfoShot, ufoShots[ind].x, ufoShots[ind].y);
			// paint the shot

			if (isSpaceshipHit(ufoShots[ind])) {
				clearBullet('ufo', ind);
			}
		}
	}
};

// Kick it off!
document.addEventListener('DOMContentLoaded', function () {
	//establish reusable sounds
	setUpSounds();

	scoreNum = document.querySelector('#scoreNum');
	versionNum = document.querySelector('.versionNum');
	lifeNum = document.querySelector('#lifeNum');
	highScoreCnt = document.querySelector('#highScoreCnt');
	gameWrapper = document.querySelector('#game__wrapper');
	gameOverBoard = document.querySelector('#gameOverBoard');
	startOver = document.querySelector('#startOver');
	document.querySelector('#currentYear').innerText = currentYear;

	dialogCloseBtn.addEventListener('click', () => {
		modalHandler();
	});

	for (let i = 0; i < versionNum.length; i++) {
		versionNum[i].innerText = version;
	}

	resetGame();

	// show instructions for desktop
	if (xLimit > 768) {
		inPlay = false;
		modalHandler('open');
	}

	//kick off animation
	let startAstroStorm = setInterval(function () {
		animateScreen();
	}, deltaTime);
});
