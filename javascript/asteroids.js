/**
 * Create asteroids
 */
function regenerateAsteroids() {
	scale = 1;
	beatCnt = 1000;
	clearInterval(heartbeat);
	rock_max_v = rock_max_v + 0.25;
	if (rock_max_v >= rock_max_v_cap) {
		rock_max_v = rock_max_v_cap; //cap out speed
	}

	for (var i = 0; i < rockCnt; i++) {
		rockID++;
		let thisRockSize = 100;
		asteroids.push(new Asteroid(rockID, 'asteroid' + i, thisRockSize / screenScale, thisRockSize / screenScale, getSafeRandomFloat(0, (xLimit - 150)), getSafeRandomFloat(0, (yLimit - 150)), getRandomFloat(-Math.abs(rock_max_v), rock_max_v), getRandomFloat(-Math.abs(rock_max_v), rock_max_v), Asteroid.colors[Math.floor(getRandomFloat(0, 5))], 'generic', false, 20));
	}

	for (var key in asteroids) {
		if (asteroids.hasOwnProperty(key)) {
			makeRock(asteroids[key].id, asteroids[key].width, asteroids[key].height, asteroids[key].color, scale, Asteroid.rocksLrg[Math.floor(getRandomFloat(0, 3))])
		}
	}
}

/**
 * 
 * @param {*} id - int astroid id
 * @param {*} w -int width
 * @param {*} h - int height 
 * @param {*} color 
 * @param {*} scale 
 * @param {*} path 
 */
function makeRock(id, w, h, color, scale, path) {
	var newRock = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	newRock.setAttribute('id', `rockAnim${id}`);
	newRock.setAttribute('data-id', id);
	newRock.setAttribute("aria-hidden", "true");
	newRock.style.cssText = `color:${color}, border-color:${color}`;
	newRock.setAttribute('class', 'asteroid rockAnim');

	newRock.classList.add(`rock${scale * 100}`);


	let rockPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	rockPath.setAttribute("fill-rule", "evenodd");
	rockPath.setAttribute("d", `M${path} Z`);
	rockPath.setAttribute("stroke", color);
	rockPath.setAttribute("stroke-width", 2);
	rockPath.setAttribute("cx", w);
	rockPath.setAttribute("cy", h);
	rockPath.setAttribute("r", 10);
	rockPath.setAttribute("transform", `scale(${scale}, ${scale})`);

	newRock.appendChild(rockPath);

	document.body.appendChild(newRock);

}

/**
 * Clear shot asteroid and make splitter pieces
 * @param {*} x int
 * @param {*} y int
 * @param {*} size int
 * @param {*} cnt int
 */
function makeAsteroidPieces(x, y, size, cnt) {
	for (let i = 0; i < cnt; i++) {
		rockID++;
		let maxVel = rock_max_v;
		let rockPnt = 20;
		//which transform scale to implement
		switch (size) {
			case 100: //large
				scale = '1';
				maxVel = rock_max_v;
				rockPnt = 20;
				break;
			case 50: //medium
				scale = '.5';
				maxVel = rock_max_v + 1;
				rockPnt = 50;
				break;
			case 25: //small 
				scale = '.25';
				maxVel = rock_max_v + 2;
				rockPnt = 100;
				break;
		}

		asteroids.push(new Asteroid(rockID, 'test', size, size, x, y, getRandomFloat(-Math.abs(maxVel), maxVel), getRandomFloat(-Math.abs(maxVel), maxVel), Asteroid.colors[Math.floor(getRandomFloat(0, 5))], 'generic', false, rockPnt));

		makeRock(asteroids[asteroids.length - 1].id, asteroids[asteroids.length - 1].width, asteroids[asteroids.length - 1].height, asteroids[asteroids.length - 1].color, scale, Asteroid.rocksLrg[Math.floor(getRandomFloat(0, 3))])
	}
}

/**
 * handle asteroid being struck by a bullter
 * @param {*} obj array -the asteroid in the array to be worked on
 * @param {*} idx int - what asteroid -  index in the array
 */
function blowupAsteroid(obj, idx, shot) {
	switch (obj.width) {
		case 100:
			astroBoom100Snd.cycle();
			break;
		case 50:
			astroBoom50Snd.cycle();
			break;
		case 25:
			astroBoom25Snd.cycle();
			break;
	}

	pointCnt(obj.points);
	beatCnt = beatCnt - 12;
	heartBeatSnd(beatCnt);

	//make and clean up astroids array and svg's
	if (obj.height > 25) {
		makeAsteroidPieces(obj.x, obj.y, (obj.height / 2), 2);
	}

	clearDomItem('rockAnim' + obj.id);
	clearDomItem('shot' + shot);

	asteroids.splice(idx, 1);

	if (asteroids.length == 0) {
		regenerateAsteroids();
	}
}