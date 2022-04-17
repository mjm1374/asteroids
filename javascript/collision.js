/**
 * Check to see if Obj is in contact with Spaceship
 * @param {*} obj -  the current object under inspection
 */
const inCollision = (obj) => {
	var a = spaceship;
	var b = obj;
	return !badTouch(a, b);
};

/**
 * when an object is confirmed thats its in contact with another object (spaceship, ufo or bullet)
 * @param {*} obj - the current object under inspection
 */
const isHit = (obj) => {
	var a = asteroids;
	var b = obj;

	for (let i = 0; i < a.length; i++) {
		if (badTouch(a[i], b) == false) {
			blowupAsteroid(a[i], i, b.id);
			return true;
		}
	}
};

/**
 * Spaceship is hit
 * @param {*} obj - the current object in contact with spaceship
 */
const isSpaceshipHit = (obj) => {
	var a = spaceship;
	var b = obj;

	if (badTouch(a, b) == false) {
		boom(b.id);
		ufoActive = false;
		return true;
	}
};
/**
 * The UFO is hit
 * @param {*} obj - the object in contact with the UFO
 */
const isUfoHit = (obj) => {
	var a = ufo;
	var b = obj;

	if (badTouch(a, b) == false) {
		blowupUfo(a, b.id);
		ufoActive = false;
		return true;
	}
};

const badTouch = (a, b) => {
	return (
		a.y + a.height < b.y ||
		a.y > b.y + b.height ||
		a.x + a.width < b.x ||
		a.x > b.x + b.width
	);
};
