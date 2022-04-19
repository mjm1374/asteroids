/**
 * Check to see if Obj is in contact with Spaceship
 * @param {*} obj -  the current object under inspection
 */
const inCollision = (obj) => {
	let a = spaceship;
	let b = obj;
	return !badTouch(a, b);
};
// REFACTOR - forEach method doesn't clean up bullters fast enough, sending all asterdoids at once, look at bullet clean up in blowUpAsteroids
/**
 * when an object is confirmed thats its in contact with another object (spaceship, ufo or bullet)
 * @param {*} obj - the current object under inspection
 */
let x = 0;
const isHit = (obj) => {
	let a = asteroids;
	let b = obj;

	// a.forEach((asteroid, i) => {
	// 	if (x < 20) {
	// 		console.log(badTouch(asteroid, b), badTouch(a[i], b));
	// 		x++;
	// 	}

	// 	if (badTouch(a[i], b) == false) {
	// 		blowUpAsteroid(a[i], i, b.id);
	// 		return true;
	// 	}
	// 	return false;
	// });

	for (let i = 0; i < a.length; i++) {
		if (badTouch(a[i], b) == false) {
			blowUpAsteroid(a[i], i, b.id);
			return true;
		}
	}
};

/**
 * Spaceship is hit
 * @param {*} obj - the current object in contact with spaceship
 */
const isSpaceShipHit = (obj) => {
	let a = spaceship;
	let b = obj;

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
	let a = ufo;
	let b = obj;

	if (badTouch(a, b) == false) {
		blowUpUFO(a, b.id);
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
