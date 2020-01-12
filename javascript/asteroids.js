/**
 * Create asteroids
 */
function regenerateAsteroids() {
	scale = 1;
	rock_max_v = rock_max_v + 0.25;
	if(rock_max_v >= 6){
		rock_max_v = 6; //cap out speed
	}

	for (var i = 0; i < rockCnt; i++) {
		rockID++;
		let thisRockSize = 100;
		asteroids.push(new Asteroid(rockID, 'asteroid' + i, thisRockSize / screenScale, thisRockSize / screenScale, getSafeRandomFloat(0, (xLimit - 150)), getSafeRandomFloat(0, (yLimit - 150)), getRandomFloat(-Math.abs(rock_max_v), rock_max_v), getRandomFloat(-Math.abs(rock_max_v), rock_max_v), colors[Math.floor(getRandomFloat(0, 5))], 'generic', false, 20));
	}

	for (var key in asteroids) {
		if (asteroids.hasOwnProperty(key)) {
			$('body')
				.append("<svg id='rockAnim" + asteroids[key].id + "' data-id='" + asteroids[key].id + "' class='asteroid rocksize100'><path cx='" + (asteroids[key].width) + "' cy='" + (asteroids[key].height) + "' r='" + (asteroids[key].width / 2 - 5) + "' stroke='" + asteroids[key].color + "' stroke-width='2' d='M " + rocksLrg[Math.floor(getRandomFloat(0, 3))] + " Z'  id='astroPath" + asteroids[key].id + "'  transform='scale(" + scale / screenScale + ", " + scale / screenScale + ")' /><text x='20' y='55' fill='" + asteroids[key].color + "' transform='scale(" + scale + ", " + scale + ")'></text></svg>");

			$('#rockAnim' + asteroids[key].id)
				.css('color', asteroids[key].color).css('border-color', asteroids[key].color).css('width', asteroids[key].width).css('height', asteroids[key].height).addClass('rockAnim');
		}
	}
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
		let rockPnt =  20;
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

		asteroids.push(new Asteroid(rockID, 'test', size, size, x, y, getRandomFloat(-Math.abs(maxVel), maxVel), getRandomFloat(-Math.abs(maxVel), maxVel), colors[Math.floor(getRandomFloat(0, 5))], 'generic', false, rockPnt));

		$('body')
			.append("<svg id='rockAnim" + asteroids[asteroids.length - 1].id + "' data-id='" + asteroids[asteroids.length - 1].id + "' class='asteroid rocksize" + size + "'><path cx='" + (asteroids[asteroids.length - 1].width) + "' cy='" + (asteroids[asteroids.length - 1].height) + "' r='" + (asteroids[asteroids.length - 1].width / 2 - 5) + "' stroke='" + asteroids[asteroids.length - 1].color + "' stroke-width='2' d='M " + rocksLrg[Math.floor(getRandomFloat(0, 3))] + " Z'  id='astroPath" + asteroids[asteroids.length - 1].id + "' transform='scale(" + scale + ", " + scale + ")' /><text x='20' y='55' fill='" + asteroids[asteroids.length - 1].color + "' transform='scale(" + scale + ", " + scale + ")></text></svg>");

		$('#rockAnim' + asteroids[asteroids.length - 1].id)
			.css('color', asteroids[asteroids.length - 1].color).css('border-color', asteroids[asteroids.length - 1].color).css('width', asteroids[asteroids.length - 1].width).css('height', asteroids[asteroids.length - 1].height).addClass('rockAnim');
	}
}

/**
 * handle asteroid being struck by a bullter
 * @param {*} obj array -the asteroids array 
 * @param {*} idx int - what asteroid
 */
function blowupAsteroid(obj, idx) {
	$('#sndAstroBoom').get(0).pause();
	$('#sndAstroBoom').get(0).currentTime = 0;
	$('#sndAstroBoom').get(0).play();

	pointCnt(obj.points);

	//make and clean up astroids array and svg's
	if (obj.height > 25) {
		makeAsteroidPieces(obj.x, obj.y, (obj.height / 2), 2); 
	}

	$('#rockAnim' + obj.id).remove();
	asteroids.splice(idx, 1);

	if (asteroids.length == 0) {
		regenerateAsteroids();
	}
}