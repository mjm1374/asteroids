// ----- Spaceship ---------------------------------------------------------------

/**
 * reset the spaceship to its starting state
 */
const resetSpaceShip = () => {
	spaceShipSvg = document.querySelector('#spaceship');
	if (lifeCnt > 0) {
		spaceShipSvg.style.cssText = 'display:block, opacity:.25';
		spaceship = new Spaceship(xLimit / 2, yLimit / 2, 0, 0, -90, 0, 0, 0);
		let thisSpawn = document.querySelector('#spawn');
		thisSpawn.style.left = spawnBox.x;
		thisSpawn.style.top = spawnBox.y;
		thisSpawn.style.height = spawnBox.height;
		thisSpawn.style.width = spawnBox.width;
		parkUFO();
		clearTimeout(ufoTimer);
		spawnEnemy();

		while (safeSpawn() === false) {
			inPlay = false;
			animateScreen();
		}

		inPlay = true;
		spaceShipSvg.style.opacity = '1';
	} else {
		inPlay = false;
		spaceShipSvg.style.display = 'none';
		gameOverBoard.classList.add('open');
		clearInterval(heartBeat);
		checkHighScoreCookie();
	}
};

//spaceship controls || Speed & thrust

/**
 * Update the position, speed, yaw and theta of the space ship
 * @param {*} deltaTime  default clock cycle
 */
const moveSpaceShip = (deltaTime) => {
	if (turn != 0 && turn != undefined) {
		spaceship.theta = spaceship.theta + turn * turn_per_milli * deltaTime;
		if (lifeCnt > 0) {
			turnSnd.play();
		}
	} else {
		resetSound(turnSnd);
	}
	if (thrust != 0 && thrust != undefined) {
		del_v = thrust * thrust_per_milli * deltaTime;
		del_vx = del_v * Math.cos(spaceship.theta * deg2rad);
		del_vy = del_v * Math.sin(spaceship.theta * deg2rad);

		if (lifeCnt > 0) {
			thrustSnd.play();
		}
	} else {
		del_vx = 0;
		del_vy = 0;
		resetSound(thrustSnd);
	}
	spaceship.vx = spaceship.vx + del_vx;
	spaceship.vy = spaceship.vy + del_vy;
};

/**
 * paints the screen with the spaceship, set screen position
 * @param {int} deltaTime default time cycle
 */
const updateSpaceShip = (deltaTime) => {
	if (spaceship.x >= xLimit) {
		spaceship.x = 0;
	}
	if (spaceship.x < 0) {
		spaceship.x = xLimit;
	}
	if (spaceship.y >= yLimit) {
		spaceship.y = 0;
	}
	if (spaceship.y < 0) {
		spaceship.y = yLimit;
	}

	spaceship.theta += spaceship.yaw * deltaTime;
	spaceship.x += spaceship.vx * deltaTime;
	spaceship.y += spaceship.vy * deltaTime;

	moveSpaceShip(deltaTime);
	moveItem(spaceShipSvg, spaceship.x, spaceship.y, spaceship.theta);
	// Paint the spaceship
};

/**
 * Traveling through hyperspace ain't like dusting crops, boy!
 *  Without precise calculations we could fly right through a star or
 * bounce too close to a supernova and that'd end your trip real quick,
 * wouldn't it?
 */
/**
 * JUMP! -  randomly reassign the x & y positions
 */
const hyperspace = () => {
	if (lifeCnt > 0 && inPlay == true) {
		if (jumpCnt > 0) {
			hyperpaceSnd.cycle();
			spaceship.x = getRandomFloat(1, xLimit - 5);
			spaceship.y = getRandomFloat(1, yLimit - 5);
			spaceship.vx = 0;
			spaceship.vy = 0;
			jumpCnt--;
			highScoreCnt.innerText = jumpCnt;
		} else {
			hyperSpaceFailSnd.play();
		}
	}
};

/**
 * you died! - hide spaceship and start reset cycle
 */
const boom = (shot) => {
	spaceShipSvg.style.display = 'none';
	inPlay = false;
	ufoActive = false;
	spaceship.x = -1000;
	spaceship.y = -1000;
	spaceship.vx = 0;
	spaceship.vy = 0;
	boomSnd.play();
	clearDomItem(`ufoShot${shot}`);

	if (lifeCnt > 0) {
		lifeCnt--;

		setTimeout(function () {
			jumpCnt = 3;
			resetSpaceShip();
		}, 3000);
	}
};

/**
 * put the SVG spaceship in the DOM
 */
const addSpaceShip = () => {
	//Add space ship
	let newShip = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	newShip.setAttribute('id', `spaceship`);
	let shipPath = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	shipPath.setAttribute('stroke', '#fff');
	shipPath.setAttribute('stroke-width', 2);
	shipPath.setAttribute('d', `M ${spaceship.shape} Z`);
	shipPath.setAttribute('id', 'outerShip');
	newShip.appendChild(shipPath);

	document.body.appendChild(newShip);
};

// ----- UFO's ---------------------------------------------------------------

/**
 * Kick off a new UFO
 */
const spawnEnemy = () => {
	clearDomItem('ufoShip');
	let timer = Math.floor(getRandomFloat(25, 60) * 1000);
	ufoTimer = setTimeout(() => {
		makeUFO(true, 0.1);
	}, timer);
};

// the Alien UF0 -  call Mulder and Scully
/**
 * UFO settings and paint to screen
 * @param {boolean} active boolean
 * @param {int} scale int
 */
const makeUFO = (active, scale) => {
	ufoActive = active;
	let direction = Math.random() < 0.5 ? -1 : 1;
	ufo.x =
		direction > 0 ? (ufo.x = 0 - ufo.width) : (ufo.x = xLimit + ufo.width);

	ufoSizeVar = Math.pow(Math.floor(Math.random() * 10), 2);
	ufoAim--; //every ship aims better
	if (ufoAim < 0) ufoAim = 0;
	let ufoScale = scale;
	ufo.y = getRandomFloat(0, yLimit);
	ufo.vx = getRandomFloat(1, ufoMaxSpeed) * direction;
	ufoMaxSpeed = ufoMaxSpeed + 0.25;
	if (ufoMaxSpeed > 10) ufoMaxSpeed = 10;
	ufo.points = 200;

	// little ship
	if (ufoSizeVar > 75 || score >= 100000) {
		ufoScale = 0.06;
		ufo.vx = getRandomFloat(3, 10) * direction;
		ufoAim = 0;
		ufo.points = 1000;
	}

	let newUFO = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	newUFO.setAttribute('id', 'ufoShip');
	newUFO.setAttribute('class', 'ufo');
	newUFO.setAttribute('aria-hidden', 'true');

	let ufoPath = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'polygon'
	);
	ufoPath.setAttribute('fill-rule', 'evenodd');
	ufoPath.setAttribute('points', Ufo.SHAPE);
	ufoPath.setAttribute('stroke', '#fff');
	ufoPath.setAttribute('stroke-width', 15);
	ufoPath.setAttribute('id', 'myPolygon');
	ufoPath.setAttribute('transform', `scale(${ufoScale}, ${ufoScale})`);

	newUFO.appendChild(ufoPath);

	document.body.appendChild(newUFO);

	newUFO.style.cssText = `width: ${ufo.width}, height: ${ufo.height}`;

	let startFiring = setInterval(enemyShooter, ufoShootingSpeed);

	function enemyShooter() {
		if (ufoActive == true && inPlay == true) {
			ufoShotCnt++;
			let angleDeg =
				(Math.atan2(spaceship.y - ufo.y, spaceship.x - ufo.x) * 180) /
					Math.PI +
				getRandomFloat(ufoAim * -1, ufoAim);
			ufoShots.push(
				new Shot(
					ufoShotCnt,
					'ufo',
					ufo.x,
					ufo.y,
					ufo.vx,
					ufo.vy,
					angleDeg,
					ufo.yaw,
					1800,
					0,
					0
				)
			);
			ufoBulletSnd.play();
			ufoScale == 0.1 ? saucerBigSnd.play() : saucerSmallSnd.play();

			makeShotSVG(ufoShotCnt, 'ufoShot', '#0f0');
		} else {
			clearInterval(startFiring);
			ufoScale == 0.1
				? resetSound(saucerBigSnd)
				: resetSound(saucerSmallSnd);
		}
	}
};

/**
 * remove the UFO after being hit by bullter
 * @param {*} obj the UFO
 */
const blowUpUFO = (obj, shot) => {
	ufoBoomSnd.cycle();
	clearDomItem('ufoShip');
	clearDomItem(`spaceShipShot${shot}`);
	pointCnt(obj.points);
	parkUFO();
	clearTimeout(ufoTimer);
	spawnEnemy();
};

/**
 * Park the UFO off screen until it is needed again
 */
const parkUFO = () => {
	clearDomItem('ufoShip');
	ufoActive = false;
	ufo.x = -200;
	ufo.y = -200;
	ufo.vx = 0;
	ufo.vy = 0;
	clearDomClass('ufoShot');
};
