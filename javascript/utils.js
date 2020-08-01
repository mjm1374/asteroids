$(window).resize(function () {
	xLimit = resetWindowLimit("x");
	yLimit = resetWindowLimit("y");
});

/**
 * Reset the window paramameters when resized
 * @param {*} whatDim  - string, X or Y
 */
function resetWindowLimit(whatDim) {
	var newDim, newDimx, newDimy;
	newDimx = window.innerHeight;
	newDimy = window.innerHeight;
	if (whatDim == "x") {
		newDim = window.innerWidth;
		for (let i = 0; i < asteroids.length; i++) {
			if (asteroids[i].x >= (newDimx - asteroids[i].width)) {
				asteroids[i].changePosition((newDimx - asteroids[i].width), (newDimy - asteroids[i].height));
			}
		}
	} else {
		newDim = window.innerHeight;
		for (let i = 0; i < asteroids.length; i++) {
			if (asteroids[i].y >= (newDimy - asteroids[i].height)) {
				asteroids[i].changePosition((newDimx - asteroids[i].width), (newDim - asteroids[i].height));
			}
		}
	}
	return newDim;
}

/**
 * Get a randome float between 2 values
 * @param {*} min - int
 * @param {*} max - int
 */
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}
/**
 * set a safe randome float inside coordinates
 * @param {*} min - int
 * @param {*} max - int
 */
function getSafeRandomFloat(min, max) {
	var split = min + max / 2;
	var tempCoord = Math.random() * (max - min) + min;
	var finalCoord = 0;
	if (tempCoord >= split) {
		finalCoord = max;
	}
	return finalCoord;
}
/**
 * 
 * @param {*} team 
 * @param {*} idx 
 */
function clearBullet(team, idx) {
	if (team == "ufo") {
		$('#ufoshot' + ufoShots[idx].id).remove();
		ufoShots.splice(idx, 1);
	} else {
		$('#shot' + shots[idx].id).remove();
		shots.splice(idx, 1);
	}
}
/**
 * check for no asteroids in a radius of the spawn sight
 */
function safeSpawn() {
	var a = asteroids;
	var b = spawnBox;
	for (let i = 0; i < a.length; i++) {
		// console.log("iu: ", a[i].exists);
		if ((((a[i].y + a[i].height) < (b.y)) ||
				(a[i].y > (b.y + b.height)) ||
				((a[i].x + a[i].width) < b.x) ||
				(a[i].x > (b.x + b.width))) == false) {
			return true;
		}
	}
}

/**
 * Reset the game to default games start values
 */
function resetgame() {
	gameOverBoard.style.display = 'none';
	//$('*').css('cursor','none'); // clear cursor
	$(".asteroid").remove();
	lifeCnt = 3;
	jumpCnt = 3;
	score = 0;
	newLife = newLifeTarget;
	ufoAim = 50;
	asteroids = [];

	regenerateAsteroids();

	//Add space ship
	$('body').append("<svg id='spaceship' class=''><path cx='5' cy='5' r='10' stroke='#ffffff' stroke-width='2' d='M " + spaceship.shape + " Z'  id='outerShip' /></svg>");

	resetSpaceship();
}

/**
 * update the score
 * @param {*} num  - int
 */
function pointCnt(num) {
	score = score + num;
	newLife = newLife - num;
	if (newLife < 0) {
		lifeCnt++;
		newLife = newLifeTarget + newLife;
		playExtraLife();
	}
	//console.log(newLife);
}



/**
 * play sound for extra life
 */
function playExtraLife() {
	var extraLifesnd = new Sound('snd/extraShip.ogg');
	setTimeout(function () {
		extraLifesnd.play();
	}, 1);
	setTimeout(function () {
		extraLifesnd.play();
	}, 250);
	setTimeout(function () {
		extraLifesnd.play();
	}, 500);
}



/**
 * 
 * @param {*} obj Object - the item to move
 * @param {*} x int -  the x value
 * @param {*} y int - the y value
 * @param {*} t int - theta , the rotational value
 */
function moveItem(obj, x, y, t) {

	try {
		obj.style.left = x;
		obj.style.top = y;
		obj.style.transform = `rotate(${t}deg)`;
	} catch (e) {
		console.error(e.name); // logs 'Error'
		console.error(e.message); // logs 'The message', or a JavaScript error message
	}

};


/**
 * Hide the cursor when game play is happening
 */
function hideCursor() {
	if (inPlay == true) {
		gameWrapper.classList.add('cursorHide')
	} else {
		gameWrapper.classList.remove('cursorHide')
	}
}




// localStorage ---------------------------------------------------------------------------------------

function checkHighScoreCookie() {
	var hs = localStorage.getItem("highScore-asteroids");

	if (hs == "" || hs == undefined) {
		localStorage.setItem("highScore-asteroids", score);
		$('#highScore span').text(score);
	} else {
		if (hs <= score) {
			localStorage.setItem("highScore-asteroids", score);
			$('#highScore span').text(score);
		} else {
			$('#highScore span').text(hs);
		}
	}

}