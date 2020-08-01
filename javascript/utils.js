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
		clearDomItem('ufoShip' + ufoShots[idx].id);
		ufoShots.splice(idx, 1);
	} else {
		clearDomItem('shots' + shots[idx].id);
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
	clearDomClass('asteroid');
	lifeCnt = lifeStart;
	jumpCnt = jumpStart;
	score = 0;
	newLife = newLifeTarget;
	ufoAim = ufoAimStart;
	asteroids = [];

	regenerateAsteroids();

	//Add space ship
	var newShip = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	newShip.setAttribute('id', `spaceship`);
	let shipPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	shipPath.setAttribute("stroke", '#fff');
	shipPath.setAttribute("stroke-width", 2);
	shipPath.setAttribute("d", `M ${spaceship.shape} Z`);
	shipPath.setAttribute("id", 'outerShip');
	newShip.appendChild(shipPath);

	document.body.appendChild(newShip);

	resetSpaceship();
}


function clearDomClass(thisClass) {
	let el = document.getElementsByClassName(thisClass);
	for (let i = 0; i < el.length; i + 1) {
		let thisRock = document.getElementById(el[i].id);
		thisRock.remove();
	}
}

function clearDomItem(thisId) {
	let el = document.getElementById(thisId);
	if (el != null) {
		el.remove();
	}

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
	let hs = localStorage.getItem("highScore-asteroids");
	let highscore = document.getElementById('highScore').children;

	if (hs == "" || hs == undefined) {
		localStorage.setItem("highScore-asteroids", score);
		highscore[0].innerHTML = score;
	} else {
		if (hs <= score) {
			localStorage.setItem("highScore-asteroids", score);
			highscore[0].innerHTML = score;
		} else {
			highscore[0].innerHTML = hs;
		}
	}

}