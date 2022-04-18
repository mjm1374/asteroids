//initialize the environment
const version = 1.34,
	deltaTime = 20,
	lifeStart = 3,
	jumpStart = 3,
	newLifeTarget = 10000,
	rockID = 0,
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
	heartBeat = null,
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
	updateShots(shots);
	updateShots(ufoShots);
	updateSpaceShip(deltaTime);
	updateScoreCard();
};

// END animation Loop -------------------------------------------------------------------------------------------

/**
 * Controls to update the Score, life and Hyperspace count
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
	asteroids.forEach((asteroid) => {
		asteroid.changePosition(
			asteroid.x + asteroid.xv,
			asteroid.y + asteroid.yv
		);

		if (mode == 'asteroids') {
			if (
				asteroid.x <= 0 - asteroid.width ||
				asteroid.x >= xLimit + asteroid.width
			) {
				if (asteroid.x >= xLimit + asteroid.width) {
					asteroid.x = -Math.abs(0 - asteroid.width);
				} else {
					asteroid.x = xLimit + asteroid.width;
				}
			}

			if (
				asteroid.y <= 0 - asteroid.width ||
				asteroid.y >= yLimit + asteroid.height
			) {
				if (asteroid.y >= yLimit + asteroid.height) {
					asteroid.y = -Math.abs(0 - asteroid.height);
				} else {
					asteroid.y = yLimit + asteroid.height;
				}
			}
		}

		if (inPlay == true) {
			if (inCollision(asteroid)) {
				boom();
			}
		}

		let thisRock = document.querySelector(`#rockAnim${asteroid.id}`);
		moveItem(thisRock, asteroid.x, asteroid.y);
	});
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
const updateShots = (teamShots) => {
	teamShots.forEach((shot) => {
		let thisVX = Math.cos((shot.theta * Math.PI) / 180) * 10 + shot.x;
		let thisVY = Math.sin((shot.theta * Math.PI) / 180) * 10 + shot.y;
		let thisLife = shot.life - 5;
		let ShotTagId =
			shot.team === 'spaceShip'
				? `#spaceShipShot${shot.id}`
				: `#ufoShot${shot.id}`;
		shot.changeLife(thisLife);

		if (shot.life < 0) {
			clearBullet(shot.team, shot.id);
		} else {
			shot.changePosition(thisVX, thisVY);
			let thisShot = document.querySelector(ShotTagId);
			moveItem(thisShot, shot.x, shot.y);
			// paint the shot

			if (shot.team === 'spaceShip') {
				if (isHit(shot)) clearBullet(shot.team, shot.id);

				if (isUfoHit(shot)) clearBullet(shot.team, shot.id);
			}

			if (shot.team === 'ufo') {
				if (isSpaceShipHit(shot)) clearBullet(shot.team, shot.id);
			}
		}
	});
};

// Kick it off!
document.addEventListener('DOMContentLoaded', () => {
	//establish reusable sounds
	setUpSounds();

	scoreNum = document.querySelector('#scoreNum');
	versionNum = document.querySelectorAll('.versionNum');
	lifeNum = document.querySelector('#lifeNum');
	highScoreCnt = document.querySelector('#highScoreCnt');
	gameWrapper = document.querySelector('#game__wrapper');
	gameOverBoard = document.querySelector('#gameOverBoard');
	startOver = document.querySelector('#startOver');
	document.querySelector('#currentYear').innerText = currentYear;

	dialogCloseBtn.addEventListener('click', () => {
		modalHandler();
	});

	versionNum.forEach((element) => (element.innerText = version));

	resetGame();

	// show instructions for desktop
	if (xLimit > 768) {
		inPlay = false;
		modalHandler('open');
	}

	//kick off animation
	let startAstroStorm = setInterval(() => {
		animateScreen();
	}, deltaTime);
});
