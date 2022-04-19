// one AG-2G quad laser cannon - must install more
/**
 * start the creation of the shot
 */
const pewpew = () => {
	if (lifeCnt > 0 && resetGun === true && inPlay === true) {
		shootSnd.play();
		makeShot('spaceShip');
		resetGun = false;
	}
};

/**
 * Create the shot
 */
const makeShot = (team) => {
	shotCnt++;
	shots.push(
		new Shot(
			shotCnt,
			team,
			spaceship.x + spaceship.width / 2,
			spaceship.y + spaceship.height / 2,
			spaceship.vx,
			spaceship.vy,
			spaceship.theta,
			spaceship.yaw,
			1800,
			0,
			0
		)
	);
	makeShotSVG(shotCnt, 'spaceShipShot', '#f00');
};

// REFACTOR to make a SVG creation object
/**
 *
 * @param {*} id - int - the id of the shot to map to
 * @param {*} team - string -  the team of the shot, options: shot or ufoShot
 * @param {*} color - string -  a hex or css color
 */
const makeShotSVG = (id, team, color) => {
	let newShot = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	newShot.setAttribute('id', `${team}${id}`);
	newShot.setAttribute('data-id', id);
	newShot.setAttribute('class', `${team}`);
	newShot.setAttribute('height', 6);
	newShot.setAttribute('width', 6);

	let shotPath = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'circle'
	);
	shotPath.setAttribute('cx', 3);
	shotPath.setAttribute('cy', 3);
	shotPath.setAttribute('r', 10);
	shotPath.setAttribute('stroke', '#fff');
	shotPath.setAttribute('stroke-width', 1);
	shotPath.setAttribute('fill', color);

	newShot.appendChild(shotPath);
	document.body.appendChild(newShot);
};

/**
 * @param {*} array - array
 * @param {*} idx - int
 * @param {*} element - string
 */
const clearBullet = (array, idx, element) => {
	array = array.filter((shot) => shot.id !== idx);
	clearDomItem(element);
	return array;
};
